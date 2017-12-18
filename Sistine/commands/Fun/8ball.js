const { Command } = require('klasa');

module.exports = class eightBall extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8', 'magic', '8ball', 'mirror'],

			description: 'Magic 8-Ball, does exactly what the toy does.',
			usage: '<Question:str>'
		});
		this.cost = 10;
	}

	async run(msg, [question]) {
		return msg.send(question.endsWith('?') ?
			msg.language.get('COMMAND_8BALL', msg.author.username, question) :
			msg.language.get('COMMAND_8BALL_NOT_QUESTION'));
	}

};

