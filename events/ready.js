const { Event } = require('klasa');
const { updateStatus } = require('../util/Util');
const { startDashboard } = require('../util/Dashboard');

module.exports = class Ready extends Event {

	async run() {
		const that = this;
		startDashboard(this.client);

		setInterval(() => {
			that.client.stats.gauge('client.guilds', that.client.guilds.size);
			that.client.stats.gauge('client.users', that.client.users.size);
			that.client.stats.gauge('client.channels', that.client.channels.size);
			that.client.stats.gauge('client.ping', that.client.ping);
			that.client.stats.gauge('client.memory', `${process.memoryUsage().heapUsed}`);
		}, 180000);

		this.client.raven.config(this.client.keys.raven).install();
		updateStatus(this.client);
	}

	async init() {
		if (!this.client.settings.guilds.schema.logChannel) {
			await this.client.settings.guilds.schema.addKey('logChannel', { type: 'TextChannel', default: null });
		}
		if (!this.client.settings.guilds.schema.playerLogLevel) {
			await this.client.settings.guilds.schema.addKey('playerLogLevel', { type: 'Integer', default: 0, min: 0, max: 3 });
		}
	}

};
