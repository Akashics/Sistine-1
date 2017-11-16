const ytdl = require('ytdl-core');
const getInfoAsync = require('util').promisify(ytdl.getInfo);

/* eslint-disable no-throw-literal */

module.exports = class InterfaceMusic {

	constructor(guild) {
		Object.defineProperty(this, 'client', { value: guild.client });
		Object.defineProperty(this, 'guild', { value: guild });
		this.recentlyPlayed = new Array(10);
		this.queue = [];
		this.channel = null;

		this.dispatcher = null;

		this.autoplay = false;
		this.next = null;

		this.status = 'idle';
	}

	async add(user, url) {
		const song = await getInfoAsync(url).catch((err) => {
			this.client.emit('log', err, 'error');
			throw `An error has occured while attempting to add this video. \`\`\`Youtube Video: ${url}\n${err}\`\`\``;
		}).then(() => {
			if (!song.id) throw 'There was an error in adding this song, because its ID did not register correctly.';
		});

		const metadata = {
			url: `https://youtu.be/${song.video_id}`,
			title: song.title,
			requester: user,
			loudness: song.loudness,
			seconds: parseInt(song.length_seconds)
		};

		this.queue.push(metadata);

		this.next = this.getLink(song.related_videos);

		return metadata;
	}

	getLink(playlist) {
		for (const song of playlist) {
			if (!song.id || this.recentlyPlayed.includes(`https://youtu.be/${song.id}`)) {
				continue;
			}
			return `https://youtu.be/${song.id}`;
		}
		return null;
	}

	join(voiceChannel) {
		return voiceChannel.join()
			.then(() => {
				this.client.emit('warn', `Music:: Opened process for ${this.guild.name}`);
			})
			.catch((err) => {
				if (String(err).includes('ECONNRESET')) { throw 'There was an issue connecting to the voice channel.'; }
				if (String(err).includes('VOICE_JOIN_CHANNEL') && String(err).includes('it is full')) { throw 'That channel is full, I cannot join it.'; }
				this.client.emit('log', err, 'error');
				throw err;
			});
	}

	async leave() {
		if (!this.voiceChannel) { throw 'I am not in a voice channel.'; }
		this.dispatcher = null;
		this.status = 'idle';

		await this.voiceChannel.leave();
		this.client.emit('warn', `Music:: Closed process for ${this.guild.name}`);
		return this;
	}

	async play() {
		if (!this.voiceChannel) {
			throw 'I am not in a voice channel.';
		} else if (!this.connection) {
			throw 'Sistine\'s Dispatcher was not able to find a stable connection. Discord\'s API might be having issues.';
		} else if (!this.queue[0]) {
			throw 'The queue is empty.';
		} else if (this.voiceChannel.members.size <= 1) {
			throw '._. Everyone left, Music has stopped playing.';
		}

		this.pushPlayed(this.queue[0].url);

		const stream = await ytdl(this.queue[0].url, { filter: 'audio' })
			.on('error', (err) => {
				this.client.emit('error', err);
				this.skip();
				throw `Video Errored: ${this.queue[0].url} - G: ${this.guild.id}`;
			});

		this.dispatcher = this.connection.playStream(stream, { passes: 5 });
		return this.dispatcher;
	}

	pushPlayed(url) {
		this.recentlyPlayed.push(url);
		this.recentlyPlayed.shift();
	}

	pause() {
		if (!this.dispatcher) throw ':/ A error occured where a dispatcher wasn\'t called. You might want to contact support.';
		this.dispatcher.pause();
		this.status = 'paused';
		return this;
	}

	resume() {
		this.dispatcher.resume();
		this.status = 'playing';
		return this;
	}

	skip(force = false) {
		if (force && this.dispatcher) {
			this.dispatcher.end();
		} else { this.queue.shift(); }
		return this;
	}

	prune() {
		this.queue = [];
		return this;
	}

	async destroy() {
		if (this.voiceChannel) { await this.voiceChannel.leave(); }

		this.recentlyPlayed = null;
		this.dispatcher = null;
		this.status = null;
		this.queue = null;
		this.autoplay = null;
		this.next = null;

		this.client.queue.delete(this.guild.id);
	}

	get voiceChannel() {
		return this.guild.me.voiceChannel;
	}

	get connection() {
		return this.voiceChannel ? this.voiceChannel.connection : null;
	}

};
