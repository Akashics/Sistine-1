const { Command } = require('klasa');

module.exports = class Autoplay extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: (msg) => msg.language.get('COMMAND_AUTOPLAY_DESCRIPTION'),
			extendedHelp: (msg) => msg.language.get('COMMAND_AUTOPLAY_EXTENDEDHELP')
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		const enabled = music.autoplay === false;

		music.autoplay = enabled;

		return msg.send(msg.language.get('COMMAND_AUTOPLAY', enabled, msg.author.tag));
	}

};
