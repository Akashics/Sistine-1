const { Command } = require('klasa');

module.exports = class Roast extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['burn'],
			description: 'Roasts a user.',
			usage: '[UserToRoast:user]'
		});
		this.cost = 20;
	}

	async run(msg, [user = msg.author]) {
		return msg.send(msg.language.get('COMMAND_ROAST', user.username));
	}

};
