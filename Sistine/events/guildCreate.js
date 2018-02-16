const { Event } = require('klasa');
const { dBots, terminalINK, updateStatus } = require('../lib/Util');

module.exports = class guildCreate extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		this.client.emit('log', `Sistine invited to Guild: ${guild.name}[${guild.id}]. Now at ${guild.client.guilds.size} guilds.`);

		this.client.stats.increment('client.guildJoins');
		this.client.stats.gauge('client.guilds', this.client.guilds.size);

		dBots(this.client);
		terminalINK(this.client);
		updateStatus(this.client);
	}

};
