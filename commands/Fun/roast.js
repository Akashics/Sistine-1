const { Command } = require('klasa');
const roasts = require('../../util/roast');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			enabled: true,
			runIn: ['text'],
			description: 'Roasts a user.',
			usage: '[UserToRoast:member]'
		});
	}

	async run(msg, [memberMention]) {
		const member = memberMention || msg.member;
		return msg.send(`:fire: ${member.user.username} – ${roasts[Math.floor(Math.random() * roasts.length)]}`);
	}

};
