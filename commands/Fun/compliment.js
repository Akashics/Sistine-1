const { Command } = require('klasa');
const compliments = require('../../util/compliment');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Compliments a user.',
			usage: '<UserToCompliment:member>'
		});
	}

	async run(msg, [...args]) {
		return msg.send(`${args[0].user.username} – ${compliments[Math.floor(Math.random() * compliments.length)]}`);
	}

};
