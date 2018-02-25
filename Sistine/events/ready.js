const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const API = require('../api');

module.exports = class Ready extends Event {

	async run() {
		setInterval(() => {
			this.client.dbl.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count);
		}, 1800000);
		setInterval(async () => {
			this.client.updoots = await this.client.dbl.getVotes(true);
		}, 300000);

		this.client.emit('log', `[RAVEN] Sentry.io logging is ${this.client.raven.installed ? 'enabled' : 'disabled'}.`);
		if (this.client.shard.id === 0) { new API(this.client); }
		updateStatus(this.client);
	}

};
