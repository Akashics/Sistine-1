const { Command } = require('klasa');

module.exports = class EightBall extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8', 'magic', '8ball', 'mirror'],
			cooldown: 3,
			description: (msg) => msg.language.get('COMMAND_8BALL_DESCRIPTION'),
			usage: '<Question:str>'
		});
	}

	async run(msg, [question]) {
		return msg.send(msg.language.get('COMMAND_8BALL', msg.author.username, question));
	}

};

