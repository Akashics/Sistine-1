const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Leaves the voice channel.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		await music.leave();

		return msg.send(msg.language.get('MUSIC_LEFT', msg.member.voiceChannel));
	}

};
