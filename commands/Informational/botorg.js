const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class BotOrg extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Searches Discord Bots for information on a bot.',
			usage: '[BotMention:user]'
		});
	}

	async run(msg, [bot = this.client.user]) {
		try {
			const { body } = await snekfetch.get(`https://discordbots.org/api/bots/${bot.id}`);
			const build = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setAuthor('discordbots.org', 'https://discordbots.org/')
				.setTitle(body.certifiedBot ? `<:certifiedbot:373310120886796289> ${body.username}#${body.discriminator}` : `${body.username}#${body.discriminator}`)
				.setURL(`https://discordbots.org/bots/${bot.id}`)
				.setThumbnail(`https://cdn.discordapp.com/avatars/${body.id}/${body.avatar}.png?size=256`)
				.setDescription(body.shortdesc)
				.addField('➔ Prefix', body.prefix, true)
				.addField('➔ Library', body.lib, true)
				.addField('➔ Certified', body.certifiedBot ? 'Yes' : 'No :/', true)
				.addField('➔ Server Count', body.server_count, true)
				.addField('➔ Invite', `[Invited Link](${body.invite})`, true)
				.addField('➔ Website', `[Webby Site](${body.website})` || 'No Website', true)
				.addField('➔ Updoots', body.points, true)
				.addField('➔ Owner', this.client.users.filter(user => body.owners.includes(user.id)).map(user => user.tag), true);
			return msg.sendEmbed(build);
		} catch (err) {
			if (err.status === 404) return msg.send(`<:tickNo:373304949234204682> Could not find any results for ${bot.tag}.`);
			return msg.send(`<:tickNo:373304949234204682> Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};
