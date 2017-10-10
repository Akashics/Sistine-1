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
		/* eslint-disable no-throw-literal */

		const { music } = msg.guild;
		if (music.status === 'paused') throw msg.language.get('MUSIC_ALREADYPAUSED');

		music.pause();
		return msg.send(msg.language.get('MUSIC_PAUSED', msg.author.tag));
	}

};
