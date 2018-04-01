const { Event } = require('klasa');
const { dBots, terminalINK } = require('../lib/Util');

module.exports = class guildDelete extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	run(guild) {
		this.client.emit('log', `Removed from ${guild.name} [${guild.id}].`);

		this.client.stats.increment('client.guildLeaves');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		terminalINK(this.client);
	}

};
