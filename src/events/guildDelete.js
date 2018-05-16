const { Event } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { dBots, terminalINK, discordbotWorld } = require('../lib/util/Util');

module.exports = class guildDelete extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	run(guild) {
		if (!guild || !guild.available) return;

		const embed = new MessageEmbed()
			.setAuthor(guild.owner.tag, guild.owner.displayAvatarURL())
			.setColor('red')
			.setFooter(this.client.user.tag, this.client.user.displayAvatarURL())
			.setTitle('Left Guild')
			.setDescription(`${guild.name} (${guild.id})`)
			.setThumbnail(guild.iconURL());
		this.client.webhook.send({ embeds: [{ embed }] });

		dBots(this.client);
		terminalINK(this.client);
		discordbotWorld(this.client);
	}

};
