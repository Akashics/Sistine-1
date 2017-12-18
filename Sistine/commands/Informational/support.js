const { Command } = require('klasa');

module.exports = class Support extends Command {

	constructor(...args) {
		super(...args, { description: 'Get some of the Support Links for Sistine' });
	}

	async run(msg) {
		return msg.send(msg.language.get('COMMAND_SUPPORT'));
	}

};
