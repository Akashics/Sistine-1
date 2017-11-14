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
		if (user.bot || msg.author.bot) return msg.send('Bots cannot send/recieve points, Sorry.');
		const payer = msg.author.id;
		const payee = user.id;
		const pointsReward = 200;

		try {
			// payer: The user paying.
			const getPayer = this.client.settings.users.getEntry(payee);

			if (!getPayer.daily || Date.now() > getPayer.daily) {
				if (payer === payee) {
					const message = await msg.channel.send(`<:tickYes:373305832793833483> You have claimed your daily ${pointsReward} points, Ain't that dandy?`);
					await this.client.settings.users.updateOne(payer, 'daily', message.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
					await this.client.settings.users.updateOne(payer, 'balance', this.client.settings.users.getEntry(payer).balance + pointsReward, msg.guild);
					return null;
				} else {
					const message = await msg.send(`<:tickYes:373305832793833483> You have donated your daily ${pointsReward} points, Ain't that dandy?`);
					await this.client.settings.users.updateOne(payer, 'daily', message.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
					await this.client.settings.users.updateOne(payee, 'balance', this.client.settings.users.getEntry(payee).balance + pointsReward, msg.guild);
					return null;
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

