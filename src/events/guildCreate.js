const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { dBots, terminalINK, discordbotWorld } = require('../lib/util/Util');

module.exports = class guildCreate extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		if (!guild || !guild.available) return;
		const embed = new MessageEmbed()
			.setAuthor(guild.owner.tag, guild.owner.displayAvatarURL())
			.setColor('green')
			.setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
			.setTitle('Joined Guild')
			.setDescription(`${guild.name} (${guild.id})`)
			.setThumbnail(guild.iconURL());
		this.client.webhook.send({ embeds: [{ embed }] });
		dBots(this.client);
		terminalINK(this.client);
		discordbotWorld(this.client);
	}

};
