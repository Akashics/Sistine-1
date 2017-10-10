const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus, dev } = require('../util/Util');

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

		if (!dev) {
			const guildCount = await this.client.shard.fetchClientValues('guilds.size');

			dBots(guildCount);
			dBotsOrg(guildCount);
			updateStatus(this.client);
		}
	}

};
