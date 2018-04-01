const { Event } = require('klasa');
const { dBots, terminalINK } = require('../lib/Util');

module.exports = class guildCreate extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		this.client.emit('log', `Invited to ${guild.name} [${guild.id}].`);

		this.client.stats.increment('client.guildJoins');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		terminalINK(this.client);
	}

};
