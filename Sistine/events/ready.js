const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const webhook = require('../lib/managers/webhooks');

module.exports = class Ready extends Event {

	async run() {
		const Sistine = this.client;
		const shardid = Sistine.shard.id;

		setInterval(() => {
			Sistine.stats.gauge('client.users', Sistine.users.size);
			Sistine.stats.gauge('client.ping', Sistine.ping);
			Sistine.stats.gauge('client.memory', process.memoryUsage().heapUsed);
		}, 30000);

		Sistine.emit('log', `[RAVEN] Sentry.io logging is ${Sistine.raven.installed ? 'enabled' : 'disabled'}.`);
		// if (shardid === 0) require('../lib/API')(this.client);
		webhook(`\`\`\`tex\n$ [READY] Sistine Shard ${shardid} is available to ${Sistine.guilds.size.toLocaleString()} guilds.\`\`\``);
		updateStatus(Sistine);
	}

};
