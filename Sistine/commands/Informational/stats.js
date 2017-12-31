const { Command } = require('klasa');
const os = require('os');

module.exports = class Stats extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 0,
			aliases: ['info', 'statistics'],
			description: 'Get stats on Sistine at this point.'
		});
	}

	async run(msg) {
		return msg.send(msg.language.get('COMMAND_STATS', this.client, process, os), { code: 'asciidoc' });
	}

};
