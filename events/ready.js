const { Event } = require('klasa');
const { sendStats, updateStatus } = require('../util/Util');
const { startDashboard } = require('../util/Dashboard');

module.exports = class extends Event {

	async run() {
		this.client.appInfo = await this.client.fetchApplication();
		startDashboard(this.client);

		setInterval(async () => {
			this.client.appInfo = await this.client.fetchApplication();
		}, 60000);

		setInterval(() => {
			sendStats(this.client);
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
