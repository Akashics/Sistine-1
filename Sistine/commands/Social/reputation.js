const { Command } = require('klasa');

module.exports = class Reputation extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rep'],
			description: 'Give a user a reputal point!',
			usage: '<user:user>'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send(msg.language.get('COMMAND_REPUTATION_BOT'));
		if (msg.author.id === user.id) return msg.send(msg.language.get('COMMAND_REPUTATION_SELF'));

		const { users } = this.client;

		const giver = users.get(msg.author.id);
		const reciever = users.get(user.id);

		if (Date.now() > giver.configs.reputationTimer) {
			const message = await msg.send(msg.language.get('COMMAND_REPUTATION_SENT', user));
			await giver.configs.update('reputationTimer', message.createdTimestamp + (24 * 60 * 60 * 1000));
			return reciever.configs.update('reputation', reciever.conf.reputation + 1);
		} else {
			return msg.send(msg.language.get('COMMAND_REPUTATION_FROMNOW', giver));
		}
	}

};

