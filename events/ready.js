const { Event } = require('klasa');
const DBL = require('dblapi.js');
const { dBotsORG } = require('../config.json');
const API = require('../api');

module.exports = class Ready extends Event {

	async run() {
		const DBLAPI = new DBL(dBotsORG, this.client);
		setInterval(() => {
			DBLAPI.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count);
		}, 1800000);

		setInterval(() => {
			const games = [`${this.client.guilds.size} guilds`, `${this.client.users.size} users`, `${this.client.broadcasts.size} broadcasts`];
			this.client.user.setPresence({ activity: { name: `${games[Math.floor(Math.random() * games.length)]} |  s>help`, type: 3 } })
				.catch((err) => {
					this.client.emit('log', err, 'error');
				});
		}, 900000);

		this.client.emit('log', `[RAVEN] Sentry.io logging is ${this.client.raven.installed ? 'enabled' : 'disabled'}.`);
		if (this.client.shard.id === 0) { new API(this.client); }
	}

};
