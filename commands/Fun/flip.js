const { Command } = require('klasa');
const flip = require('flipacoin');

module.exports = class Flip extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['coin', 'coinflip'],
			description: 'Flip a coin. Heads or Tails.'
		});
	}

	async run(msg) {
		return msg.send(msg.language.get('COINFLIP', flip()));
	}

};
