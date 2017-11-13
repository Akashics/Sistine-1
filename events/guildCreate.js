const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class guildCreate extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		if (!this.client.whitelist.includes(guild.id)) {
			if (this.client.blocklist.includes(guild.ownerID)) {
				guild.leave();
				this.client.emit('warn', `⚠ Blocked Server Owner: ${guild.name}[${guild.id}] ${guild.owner.user.username}[${guild.owner.user.id}]`);
				return;
			}

			if ((Date.now() - guild.owner.user.createdTimestamp) / 1000 / 60 / 60 / 24 < 1) {
				guild.leave();
				this.client.emit('warn', `⚠ Young Server Owner: ${guild.name}[${guild.id}] ${guild.owner.user.username}[${guild.owner.user.id}]`);
				return;
			}

			if (this.client.blacklist.includes(guild.id)) {
				guild.leave();
				this.client.emit('warn', `⚠ Blacklisted Guild: ${guild.name}[${guild.id}] ${guild.owner.user.username}[${guild.owner.user.id}]`);
				return;
			}

			const fullGuild = await guild.members.fetch();
			const botsCount = fullGuild.filter(mem => mem.user.bot).size;
			if (fullGuild.memberCount > 25 && ((botsCount / fullGuild.memberCount * 100) > 30)) {
				guild.leave();
				this.client.emit('warn', `⚠ Bot Collection Guild: ${guild.name}[${guild.id}] joined with ${(botsCount / guild.memberCount * 100).toFixed(2)}% of bots.`);
				return;
			}
			this.client.emit('log', `Guild Join: No Problems found for: ${guild.name}[${guild.id}]`);
		} else {
			this.client.emit('log', `Whitelisted Guild Joined: ${guild.name}[${guild.id}]`);
		}

		this.client.stats.increment('client.totalGuildJoins');

		dBots(this.client);
		dBotsOrg(this.client);
		updateStatus(this.client);
	}

};
