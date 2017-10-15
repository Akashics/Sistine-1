const { Event } = require('klasa');
const { sendStats, updateStatus } = require('../util/Util');
const { startDashboard } = require('../util/Dashboard');
const { dev } = require('../keys.json');

module.exports = class extends Event {

	async run() {
		startDashboard(this.client);
		this.client.appInfo = await this.client.fetchApplication();

		setInterval(async () => {
			this.client.appInfo = await this.client.fetchApplication();
		}, 60000);

		if (dev) return;
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
