const { Event } = require('klasa');
const { dBots, dBotsOrg, terminalINK, updateStatus } = require('../lib/Util');

module.exports = class guildCreate extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		if (!this.client.whitelist.includes(guild.id)) {
			if (this.client.blocklist.includes(guild.ownerID)) {
				guild.leave();
				this.client.emit('warn', `Blocked Server Owner: ${guild.name}[${guild.id}] ${guild.owner.user.username}[${guild.owner.user.id}]`);
				return;
			}

			if (this.client.blacklist.includes(guild.id)) {
				guild.leave();
				this.client.emit('warn', `Blacklisted Guild: ${guild.name}[${guild.id}] ${guild.owner.user.username}[${guild.owner.user.id}]`);
				return;
			}

			this.client.emit('log', `Invited to Guild: ${guild.name}[${guild.id}]`);
		} else {
			this.client.emit('log', `Whitelisted join: ${guild.name}[${guild.id}]`);
		}

		this.client.stats.increment('client.guildJoins');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		dBotsOrg(this.client);
		terminalINK(this.client);
		updateStatus(this.client);
	}

};
