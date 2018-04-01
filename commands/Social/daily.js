const { Command } = require('klasa');
const moment = require('moment');
const DBL = require('dblapi.js');
const { dBotsORG } = require('../../config.json');

module.exports = class Daily extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Collect your daily points!',
			usage: '[user:user]'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot || msg.author.bot) return msg.send(msg.language.get('COMMAND_REPUTATION_BOT'));
		const DBLAPI = new DBL(dBotsORG, this.client);

		const payer = msg.author.configs;
		const payee = user.configs;
		const pointsReward = DBLAPI.hasVoted(msg.author.id) ? 500 : 250;

		if (Date.now() <= payer.dailyTimer) return msg.send(msg.language.get('COMMAND_DAILY_FROMNOW', moment(payer.dailyTimer).fromNow(true)));
		await msg.send(msg.language.get(`COMMAND_DAILY_${payer === payee ? 'CLAIMED' : 'DONATED'}`, pointsReward, msg.author.username, user.username));
		await payer.update('dailyTimer', Date.now() + (12 * 60 * 60 * 1000), msg.guild);
		return payee.update('balance', payee.balance + pointsReward, msg.guild);
	}

};

