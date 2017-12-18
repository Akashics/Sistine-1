const { Command } = require('klasa');

module.exports = class Reputation extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rep'],
			description: 'Give a user a reputal point!',
			usage: '<user:user>',
			enabled: false
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send(msg.language.get('COMMAND_REPUTATION_BOT'));
		if (msg.author.id === user.id) return msg.send(msg.language.get('COMMAND_REPUTATION_SELF'));
		const { users } = this.client.gateways;
		const giver = users.getEntry(msg.author.id);

		if (Date.now() > giver.reputationTimer) {
			const message = await msg.send(msg.language.get('COMMAND_REPUTATION_SENT', user));
			await users.update(msg.author.id, 'reputationTimer', message.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
			await users.update(user.id, 'reputation', users.getEntry(user.id).reputation + 1, msg.guild);
			return null;
		} else {
			return msg.send(msg.language.get('COMMAND_REPUTATION_FROMNOW', giver));
		}
	}

};

