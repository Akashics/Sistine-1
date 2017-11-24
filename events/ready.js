const { Event } = require('klasa');
const { updateStatus } = require('../util/Util');
const { startDashboard } = require('../util/Dashboard');

module.exports = class Ready extends Event {

	async run() {
		const that = this;
		startDashboard(this.client);

		setInterval(() => {
			that.client.stats.gauge('client.users', that.client.users.size);
			that.client.stats.gauge('client.ping', that.client.ping);
			that.client.stats.gauge('client.memory', `${process.memoryUsage().heapUsed}`);
		}, 30000);

		this.client.raven.config(this.client.keys.raven).install();
		updateStatus(this.client);
	}
};
