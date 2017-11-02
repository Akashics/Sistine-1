const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class BotPW extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Searches Discord Bots for information on a bot.',
			usage: '[BotMention:user]'
		});
	}

	async run(msg, [bot = this.client.user]) {
		if (!bot.bot) return msg.send('That user is not a bot.');
		try {
			const { body } = await snekfetch
				.get(`https://bots.discord.pw/api/bots/${bot.id}`)
				.set({ Authorization: this.client.keys.dBotsPW });
			const statsReq = await snekfetch
				.get(`https://bots.discord.pw/api/bots/${bot.id}/stats`)
				.set({ Authorization: this.client.keys.dBotsPW });
			const build = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setAuthor('bots.discord.pw', 'https://i.imgur.com/lrKYBQi.jpg')
				.setTitle(`${bot.username}#${bot.discriminator}`)
				.setURL(`https://bots.discord.pw/bots/${bot.id}`)
				.setDescription(body.description)
				.addField('➔ Prefix', body.prefix, true)
				.addField('➔ Library', body.library, true)
				.addField('➔ Server Count', statsReq.body.stats[0].server_count ? statsReq.body.stats[0].server_count : 'Bot has no Server Count', true)
				.addField('➔ Invite', `[Invited Link](${body.invite})`, true)
				.addField('➔ Website', `[Webby Site](${body.website})` || 'No Website', true)
				.addField('➔ Owner', this.client.users.filter(user => body.owner_ids.includes(user.id)).map(user => user.tag), true);
			return msg.sendEmbed(build);
		} catch (err) {
			if (err.status === 404) { return msg.send(`<:tickNo:373304949234204682> Could not find any results for ${bot.tag}.`); }
			return msg.send(`<:tickNo:373304949234204682> Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};
