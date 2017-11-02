const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');
const { supportServers } = require('../../keys/keys.json');

module.exports = class GuildBan extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Ban a Guild from Bot Usage.',
			usage: '<GuildIdentifier:guild|GuildID:str> <BannableReason:string> [...]',
			usageDelim: ' ',
			enabled: false
		});
	}

	async run(msg, [guild, ...reason]) {
		if (supportServers[guild.id]) { return msg.send('You cannot ban any of the support guilds.'); }

		const reasonFull = reason.join(this.usageDelim);
		this.client.banlist[guild.id] = reasonFull;
		await writeJSONAtomic('./banlist.json', this.client.banlist);

		try {
			this.client.guilds.get(guild.id).channels
				.filter(channel => channel.type === 'text')
				.find(channelFind => channelFind.permissionsFor(guild.me).has(['SEND_MESSAGES']))
				.send(`Your guild, \`${guild.name}\`, has been banned from using Sistine for \`${reasonFull}\`, please contact support. <https://sistine.ml/support>`);
		} catch (error) {
			this.client.console.error(error);
		}
		return this.client.guilds.get(guild.id).leave();
	}

};
