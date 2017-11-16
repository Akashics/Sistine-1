const { Command } = require('klasa');
const roasts = require('../../util/roast');

module.exports = class Roast extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['burn'],
			description: 'Roasts a user.',
			usage: '[UserToRoast:user]'
		});
		this.cost = 20;
	}

	async run(msg, [member = msg.author]) {
		return msg.send(`:fire: ${member.username} – ${roasts[Math.floor(Math.random() * roasts.length)]}`);
	}

};
