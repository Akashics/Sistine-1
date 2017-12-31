const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Pauses the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		if (music.status === 'idle') throw '<:eww:393547594690986018> There is no music loaded right now. :thinking:';
		if (music.status === 'paused') throw '<:eww:393547594690986018> Someone already paused the music. :thinking:';

		music.pause();
		return msg.send(`:pause_button: Music was paused by **${msg.author.tag}**.`);
	}

};
