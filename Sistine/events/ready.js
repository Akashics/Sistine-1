const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const { raven } = require('../config.json');
const webhook = require('../lib/managers/webhooks');

module.exports = class Ready extends Event {

	async run() {
		const Sistine = this.client;
		const shardid = Sistine.shard.id;

		setInterval(() => {
			Sistine.stats.gauge('client.users', Sistine.users.size);
			Sistine.stats.gauge('client.ping', Sistine.ping);
			Sistine.stats.gauge('client.memory', `${process.memoryUsage().heapUsed}`);
		}, 30000);

		Sistine.raven.config(raven).install();
		updateStatus(Sistine);
		webhook(`[READY] Shard[${shardid}]: Sistine ready! Guilds: ${Sistine.guilds.size.toLocaleString()}, Users: ${Sistine.users.size.toLocaleString()}`);

		if (shardid === 0) require('../lib/API')(this.client);
	}

};
