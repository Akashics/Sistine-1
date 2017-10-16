const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name: 'guildCreate', enabled: true });
	}

	async run(guild) {
		if (this.client.banlist[guild.id]) {
			await guild.leave();
			return;
		}
		this.client.datadog.increment('client.guildJoin');

		dBots(this.client);
		dBotsOrg(this.client);
		updateStatus(this.client);
	}

};
