const { Command } = require('klasa');

module.exports = class compliment extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['praise'],
			description: 'Compliments a user.',
			usage: '[UserToCompliment:user]'
		});
		this.cost = 10;
	}

	async run(msg, [user = msg.author]) {
		return msg.send(msg.language.get('COMMAND_COMPLIMENT', user.username));
	}

};
