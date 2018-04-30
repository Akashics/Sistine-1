const { Event } = require('klasa');
const MusicClient = require('../lib/structures/LavalinkClient');
const LavalinkPlayer = require('../lib/structures/LavalinkPlayer');

const API = require('../api');
const DBL = require('dblapi.js');

/* eslint-disable no-new */
module.exports = class Ready extends Event {

	async hookMusic() {
		this.client.lavalink = new MusicClient(this.client, this.client.config.nodes, {
			user: this.client.user.id,
			shards: this.client.shard ? this.client.shard.count : 1,
			rest: this.client.config.restnode,
			player: LavalinkPlayer
		});
		this.client.emit('log', '[MUSIC] Manager hook has been enabled.');
	}

	async dblStats() {
		const DBLAPI = new DBL(this.client.config.api.dbl.authKey, { statsInterval: 1800000, webhookPort: 6665, webhookAuth: this.client.config.api.dbl.webhookKey }, this.client);

		setInterval(() => {
			DBLAPI.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count);
		}, 1800000);

		DBLAPI.webhook.on('ready', hook => {
			if (!this.client.shard.id === 1) return;
			this.client.emit('log', `[DBL] Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
		});

		DBLAPI.webhook.on('vote', vote => {
			this.client.emit('log', `User with ID ${vote.user} just voted!`);
		});
	}

	async startAPI() {
		new API(this.client);
	}

	async run() {
		this.hookMusic();
		this.dblStats();
		if (this.client.shard.id === 0) this.startAPI();

		setInterval(() => {
			const games = [`${this.client.guilds.size} guilds`, `${this.client.users.size} users`, `${this.client.broadcasts.size} broadcasts`];
			this.client.user.setPresence({ activity: { name: `${games[Math.floor(Math.random() * games.length)]} |  s>help`, type: 3 } })
				.catch((err) => {
					this.client.emit('log', err, 'error');
				});
		}, 900000);
	}

};
