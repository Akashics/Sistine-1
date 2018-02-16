const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const webhook = require('../lib/managers/webhooks');

module.exports = class Ready extends Event {

	async run() {
		setInterval(() => {
			this.client.dbl.postStats(this.client.guilds.size, this.client.shards.id, this.client.shard.count);
		}, 1800000);
		setInterval(async () => {
			this.client.updoots = await this.client.dbl.getVotes(true);
		}, 300000);

		this.client.emit('log', `[RAVEN] Sentry.io logging is ${this.client.raven.installed ? 'enabled' : 'disabled'}.`);
		if (this.client.shard.id === 0) require('../API/API')(this.client);
		webhook(`\`\`\`tex\n$ [READY] Shard #${this.client.shard.id + 1} is available to ${this.client.guilds.size.toLocaleString()} guilds.\`\`\``);
		updateStatus(this.client);
	}

};
