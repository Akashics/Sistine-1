const { Command } = require('klasa');

module.exports = class Daily extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Collect your daily points!',
			usage: '[user:user]'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send(msg.language.get('COMMAND_REPUTATION_BOT'));

		const { users } = this.client;

		const payer = users.get(msg.author.id).conf;
		const payee = users.get(user.id).conf;
		const pointsReward = 250;

		if (Date.now() > payer.dailyTimer) {
			if (payer === payee) {
				const messg = await msg.channel.send(msg.language.get('COMMAND_DAILY_CLAIMED', msg.author.username, pointsReward));
				await payer.update('dailyTimer', messg.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
				return payee.update('balance', payee.balance + pointsReward, msg.guild);
			} else {
				const messg = await msg.send(msg.language.get('COMMAND_DAILY_DONATED', msg.author.username, user.username, pointsReward));
				await payer.update('dailyTimer', messg.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
				return payee.update('balance', payee.balance + pointsReward, msg.guild);
			}
		} else {
			return msg.send(msg.language.get('COMMAND_DAILY_FROMNOW', payer));
		}
	}

};

