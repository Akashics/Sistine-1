const { Command } = require('klasa');

module.exports = class Play extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Let\'s start the queue!'
		});
		/* eslint-disable no-new, promise/param-names */
		this.requireMusic = true;
		this.delayer = (time) => { new Promise(res => setTimeout(() => res(), time)); };
	}

	async run(msg) {
		const musicInterface = msg.guild.music;

		if (musicInterface.queue.length === 0) {
			return msg.send(`Add some songs to the queue first with ${msg.guild.configs.prefix}add`);
		}
		if (!musicInterface.dispatcher || !msg.guild.me.voiceChannel) { await this.client.commands.get('join').run(msg); }
		if (musicInterface.status === 'paused') { await this.client.commands.get('resume').run(msg); }
		if (musicInterface.status === 'playing') { return msg.send(`Someone is already playing a song. Try adding a song with \` ${msg.guild.configs.prefix[0]}add \`.`); }
		musicInterface.status = 'playing';
		musicInterface.channel = msg.channel;
		return this.play(musicInterface, msg);
	}

	async play(musicInterface, msg) {
		if (musicInterface.status !== 'playing') return null;

		const song = musicInterface.queue[0];
		if (!song) {
			if (musicInterface.autoplay) {
				return this.autoPlayer(musicInterface).then(() => this.play(musicInterface, msg));
			}
			return musicInterface.channel.send(':musical_note: Queue has ran out of songs, add more music and play again!').then(() => musicInterface.destroy());
		}
		if (song.length_seconds < 5600) return musicInterface.channel.send('💢 You cannot play songs over 1.5 hours long!').then(() => musicInterface.destroy());
		await musicInterface.channel.send(msg.language.get('MUSIC_PLAY', song));
		await this.delayer(300);

		return musicInterface.play()
			.then(
				dispatcher => dispatcher
					.on('end', () => {
						musicInterface.skip();
						this.play(musicInterface, msg);
					})
					.on('error', (err) => {
						musicInterface.channel.send(msg.language.get('MUSIC_ERR', err));
						musicInterface.client.emit('log', err, 'error');
						musicInterface.skip();
						this.play(musicInterface, msg);
					}),
				(message) => {
					musicInterface.channel.send(message);
					musicInterface.destroy();
				},
			);
	}

	autoPlayer(musicInterface) {
		return musicInterface.add('Youtube Autoplay', musicInterface.next);
	}

};
