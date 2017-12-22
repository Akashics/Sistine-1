const ytdl = require('ytdl-core');
const prism = require('prism-media');
const getInfoAsync = require('util').promisify(ytdl.getInfo);

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
			throw `Whoops! You discovered an unwanted feature! Error: ${err}.`;
		});
		if (!song.video_id) throw 'Youtube responded with an message I could not understand, sorry :/';

		const metadata = {
			url: `https://youtu.be/${song.video_id}`,
			title: song.title,
			requester: user.tag ? user.tag : user,
			loudness: song.loudness,
			seconds: parseInt(song.length_seconds),
			opus: Boolean(song.formats.find(format => format.type === 'audio/webm; codecs="opus"'))
		};

		this.queue.push(metadata);
		this.next = this.getLink(song.related_videos);
		return metadata;
	}

	getLink(playlist) {
		for (const song of playlist) {
			if (!song.id || this.recentlyPlayed.includes(`https://youtu.be/${song.id}`)) continue;
			return `https://youtu.be/${song.id}`;
		}
		return null;
	}

	join(voiceChannel) {
		return voiceChannel.join()
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
		return this;
	}

	async play() {
		if (!this.voiceChannel) throw 'I am not in a voice channel.';
		else if (!this.connection) throw 'I could not find a connection.';
		else if (this.queue.length === 0) throw 'The queue is empty.';

		const song = this.queue[0];
		this.pushPlayed(song.url);

		const streamOptions = { passes: 5, volume: 0.50 };
		if (song.opus) {
			const stream = ytdl(song.url, { filter: format => format.type === `audio/webm; codecs="opus"` })
				.pipe(new prism.WebmOpusDemuxer())
				.on('error', err => this.client.emit('log', err, 'error'));

			this.dispatcher = this.connection.playOpusStream(stream, streamOptions);
		} else {
			const stream = ytdl(song.url, { filter: 'audioonly' })
				.on('error', err => this.client.emit('log', err, 'error'));

			this.dispatcher = this.connection.playStream(stream, streamOptions);
		}

		return this.dispatcher;
	}

	pushPlayed(url) {
		this.recentlyPlayed.push(url);
		this.recentlyPlayed.shift();
	}

	pause() {
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