const { Command } = require('klasa');
const compliments = require('../../util/compliment');

module.exports = class compliment extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['praise'],
			description: 'Compliments a user.',
			usage: '[UserToCompliment:user]'
		});
		this.cost = 10;
	}

	async run(msg, [member = msg.author]) {
		return msg.send(`:speech_left: ${member.toString()} – ${compliments[Math.floor(Math.random() * compliments.length)]}`);
	}

};
