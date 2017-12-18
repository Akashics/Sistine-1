const { Command } = require('klasa');

module.exports = class Leave extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Leaves the voice channel.'
		});
		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		return music.leave();
	}

};
