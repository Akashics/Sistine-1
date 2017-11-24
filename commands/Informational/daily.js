const { Command } = require('klasa');
const moment = require('moment');

module.exports = class Daily extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Collect your daily points!',
			usage: '[user:user]'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send('<:tickNo:373304949234204682> Bots cannot have points, sorry.');
		const { users } = this.client.settings;
		const payer = msg.author.id;
		const payee = user.id;
		const pointsReward = 200;

		try {
			// payer: The user paying.
			const getPayer = users.getEntry(payer);

			if (Date.now() > getPayer.daily) {
				if (payer === payee) {
					await users.updateOne(payer, 'daily', Date.now() + (24 * 60 * 60 * 1000), msg.guild);
					await users.updateOne(payer, 'balance', users.getEntry(payer).balance + pointsReward, msg.guild);
					return msg.channel.send(`<:tickYes:373305832793833483> You have claimed your daily ${pointsReward} points, Ain't that dandy?`);;
				} else {
					await users.updateOne(payer, 'daily', Date.now() + (24 * 60 * 60 * 1000), msg.guild);
					await users.updateOne(payee, 'balance', users.getEntry(payee).balance + pointsReward, msg.guild);
					return msg.send(`<:tickYes:373305832793833483> You have donated your daily ${pointsReward} points to **${user.username}**, Ain't that dandy?`);;
				}
			} else {
				const fromNow = moment(getPayer.daily).fromNow(true);
				return msg.send(`<:tickNo:373304949234204682> You cannot claim your daily reward yet, please try again in ${fromNow}.`);
			}
		} catch (error) {
			throw error;
		}
	}

};

