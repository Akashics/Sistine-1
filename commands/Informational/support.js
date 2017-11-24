const { Command } = require('klasa');

module.exports = class Support extends Command {

	constructor(...args) {
		super(...args, { description: 'Get some of the Support Links for Sistine' });
	}

	async run(msg) {
		return msg.send('You can join our Discord Guild here: https://discord.gg/jgPNHWy \nYou can view some of the commands here: https://sistine.ml/');
	}

};
