const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Resumes the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		/* eslint-disable no-throw-literal */
		const { music } = msg.guild;
		if (music.status === 'playing') throw msg.language.get('MUSIC_NOTPAUSED');

		music.pause();
		return msg.send(msg.language.get('MUSIC_RESUMED', msg.author.tag));
	}

};
