const { Event } = require('klasa');
const { dBots, dBotsOrg, terminalINK, updateStatus } = require('../lib/Util');

module.exports = class guildDelete extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	run(guild) {
		this.client.emit('log', `Removed from Guild: ${guild.name}[${guild.id}]`);

		this.client.stats.increment('client.guildLeaves');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		dBotsOrg(this.client);
		terminalINK(this.client);
		updateStatus(this.client);
	}

};
