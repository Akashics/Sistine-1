const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus, dev } = require('../util/Util');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	async run(guild) {
		if (this.client.banlist[guild.id]) {
			return;
		}
		this.client.datadog.increment('client.guildLeaves');

		if (!dev) {
			const guildCount = await this.client.shard.fetchClientValues('guilds.size');
			const finalCount = guildCount.reduce((prev, val) => prev + val, 0);

			dBots(this.client, finalCount);
			dBotsOrg(this.client, finalCount);
			updateStatus(this.client, finalCount);
		}
	}

};
