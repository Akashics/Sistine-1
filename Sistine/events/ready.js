const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const { raven } = require('../config.json');

module.exports = class Ready extends Event {

	async run() {
		const Sistine = this.client;

		setInterval(() => {
			Sistine.stats.gauge('client.users', Sistine.users.size);
			Sistine.stats.gauge('client.ping', Sistine.ping);
			Sistine.stats.gauge('client.memory', `${process.memoryUsage().heapUsed}`);
		}, 30000);

		Sistine.raven.config(raven).install();
		updateStatus(Sistine);
	}

};
