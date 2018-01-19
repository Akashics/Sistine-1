const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Let\'s start the queue!'
		});
		this.delayer = time => new Promise(res => setTimeout(() => res(), time));
	}

	async run(msg) {
		if (!msg.guild.available) return msg.send('Your guild is not available to me due to an API outage.');
		const musicInterface = msg.guild.music;

		if (musicInterface.queue.length === 0) {
			return msg.send(`:headphones: There are no songs in the queue. Add some with \`${msg.guild.configs.prefix}add [url]\`.`);
		}
		if (!musicInterface.dispatcher || !msg.guild.me.voiceChannel) await this.client.commands.get('join').run(msg);
		if (musicInterface.status === 'paused') await this.client.commands.get('resume').run(msg);
		if (musicInterface.status === 'playing') {
			return msg.send(`:headphones: **${msg.guild.music.queue[0].requester}** is already playing a song, add a song with \`${msg.guild.configs.prefix}add [url]\`.`);
		}
		musicInterface.status = 'playing';
		musicInterface.channel = msg.channel;
		return this.play(musicInterface);
	}

	async play(musicInterface) {
		if (musicInterface.status !== 'playing') return null;

		const song = musicInterface.queue[0];

		if (!song) {
			if (musicInterface.autoplay) return this.autoPlayer(musicInterface).then(() => this.play(musicInterface));
			return musicInterface.channel.send(':stop_button: The queue ran out of songs to play, add some more!').then(() => musicInterface.destroy());
		}

		if (song.length_seconds < 5600) return musicInterface.channel.send('💢 You cannot play songs over 1.5 hours long!').then(() => musicInterface.destroy());

		await musicInterface.channel.send(`:headphones: Playing: **${song.title}** as requested by: **${song.requester}**.`);
		await this.delayer(300);

		return musicInterface.play()
			.then(
				(dispatcher) => dispatcher
					.on('end', () => {
						musicInterface.skip();
						this.play(musicInterface);
					})
					.on('error', (err) => {
						musicInterface.channel.send('🐔 Ruh roh shaggy, you discovered an unwanted feature. Developemt Teams were notified of the error.');
						musicInterface.client.emit('log', err, 'error');
						musicInterface.skip();
						this.play(musicInterface);
					}),
				(message) => {
					console.log(message);
					musicInterface.channel.send(message);
					musicInterface.destroy();
				}
			);
	}

	autoPlayer(musicInterface) {
		return musicInterface.add('YouTube AutoPlay', musicInterface.next);
	}

};
