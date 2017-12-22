const { Command } = require('klasa');

module.exports = class Daily extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Collect your daily points!',
			usage: '[user:user]',
			enabled: false
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send(msg.language.get('COMMAND_REPUTATION_BOT'));
		const { users } = this.client.gateways;
		const payer = msg.author.id;
		const payee = user.id;
		const pointsReward = 200;

		try {
			// payer: The user paying.
			const getPayer = users.getEntry(payer);

			if (Date.now() > getPayer.daily) {
				if (payer === payee) {
					await users.updateOne(payer, 'daily', Date.now() + (24 * 60 * 60 * 1000), msg.guild);
					await users.update(payer, 'balance', users.getEntry(payer).balance + pointsReward, msg.guild);
					return msg.channel.send(msg.language.get('COMMAND_DAILY_CLAIMED', msg.author.username, pointsReward));
				} else {
					await users.update(payer, 'daily', Date.now() + (24 * 60 * 60 * 1000), msg.guild);
					await users.update(payee, 'balance', users.getEntry(payee).balance + pointsReward, msg.guild);
					return msg.send(msg.language.get('COMMAND_DAILY_DONATED', msg.author.username, user.username, pointsReward));
				}
			} else {
				return msg.send(msg.language.get('COMMAND_DAILY_FROMNOW', getPayer));
			}
		} catch (error) {
			throw error;
		}
	}

};

