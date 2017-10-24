const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name: 'guildDelete', enabled: true });
	}

	run() {
		this.client.stats.increment('client.totalGuildLeaves');

		dBots(this.client);
		dBotsOrg(this.client);
		updateStatus(this.client);
	}

};
