const { Command } = require('klasa');

module.exports = class eightBall extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['8', 'magic', '8ball', 'mirror'],

			description: 'Magic 8-Ball, does exactly what the toy does.',
			usage: '<query:str>'
		});
		this.cost = 1;
		this.answers = [
			'Maybe.',
			'Certainly not.',
			'I hope so.',
			'Not in your wildest dreams.',
			'There is a good chance.',
			'Quite likely.',
			'I think so.',
			'I hope not.',
			'I hope so.',
			'Never!',
			'Fuhgeddaboudit.',
			'Ahaha! Really?!?',
			'Pfft.',
			'Sorry, bucko.',
			'Hell, yes.',
			'Hell to the no.',
			'The future is bleak.',
			'The future is uncertain.',
			'I would rather not say.',
			'Who cares?',
			'Possibly.',
			'Never, ever, ever.',
			'There is a small chance.',
			'Yes!'
		];
	}

	async run(msg, [question]) {
		return msg.send(question.endsWith('?') ?
			`🎱 ${this.answers[Math.floor(Math.random() * this.answers.length)]}` :
			"🎱 That doesn't look like a question, try again please.");
	}

};

