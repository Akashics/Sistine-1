const { Event } = require('klasa');
const { updateStatus } = require('../lib/Util');
const webhook = require('../lib/managers/webhooks');
const snekfetch = require('snekfetch');
const { dBotsORG } = require('../config.json');

module.exports = class Ready extends Event {

	async run() {
		setInterval(async () => {
			const updoots = await snekfetch.get(`https://discordbots.org/api/bots/${this.client.id}/votes`).set({ Authorization: dBotsORG }).catch((err) => {
				this.client.console.error(`[UPDOOTS] Failed to pull updoots. ${err}`);
			});
			this.client.updoots = updoots.map(user => user.id);
		}, 300000);

		this.client.emit('log', `[RAVEN] Sentry.io logging is ${this.client.raven.installed ? 'enabled' : 'disabled'}.`);
		if (this.client.shard.id === 0) require('../API/API')(this.client);
		webhook(`\`\`\`tex\n$ [READY] this.client Shard ${this.client.shard.id} is available to ${this.client.guilds.size.toLocaleString()} guilds.\`\`\``);
		updateStatus(this.client);
	}

};
