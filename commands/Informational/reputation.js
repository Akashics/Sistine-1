const { Command } = require('klasa');
const moment = require('moment');

module.exports = class Reputation extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rep'],
			description: 'Give a user a reputal point!',
			usage: '<user:user>'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send('<:tickNo:373304949234204682> Bots cannot send/recieve reputation, sorry.');
		if (msg.author.id === user.id) return msg.send('<:tickNo:373304949234204682> You cannot give yourself a reputation point!');
		const { users } = this.client.settings;
		const repReward = 1;

		const giver = users.getEntry(msg.author.id);

		if (Date.now() > giver.reputationTimer) {
			const message = await msg.send(`<:tickYes:373305832793833483> You have given your daily ${repReward} reputation point to **${user.username}**, neat.`);
			await users.updateOne(msg.author.id, 'reputationTimer', message.createdTimestamp + (24 * 60 * 60 * 1000), msg.guild);
			await users.updateOne(user.id, 'reputation', users.getEntry(user.id).reputation + repReward, msg.guild);
			return null;
		} else {
			const fromNow = moment(giver.reputationTimer).fromNow(true);
			return msg.send(`<:tickNo:373304949234204682> You cannot give another reputation point, please try again in ${fromNow}.`);
		}
	}

};

