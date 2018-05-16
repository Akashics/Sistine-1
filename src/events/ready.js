const { Event } = require('klasa');

const MusicClient = require('../lib/structures/LavalinkClient');
const LavalinkPlayer = require('../lib/structures/LavalinkPlayer');

const DashboardHooks = require('../lib/structures/DashboardHook');
const DBL = require('dblapi.js');

/* eslint-disable no-new */
module.exports = class Ready extends Event {

	async dblStats() {
		const DBLAPI = new DBL(this.client.config.api.dbl.authKey, this.client);

		setInterval(() => {
			DBLAPI.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count);
		}, 1800000);
	}

	async startAPI() {
		new DashboardHooks(this.client, { port: 6565 });

		const DBLAPI = new DBL(this.client.config.api.dbl.authKey, { statsInterval: 1800000, webhookPort: 6665, webhookAuth: this.client.config.api.dbl.webhookKey }, this.client);
		DBLAPI.webhook.on('ready', hook => {
			this.client.emit('log', `[DBL] Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
		});

		DBLAPI.webhook.on('vote', vote => {
			this.client.emit('log', `User with ID ${vote.user} just voted!`);
			this.client.console.debug(`[DBLAPI] User ${vote.user} voted:\n${vote}`);
		});
	}


	async run() {
		this.client.lavalink = new MusicClient(this.client, this.client.config.nodes, {
			user: this.client.user.id,
			shards: this.client.shard ? this.client.shard.count : 1,
			rest: this.client.config.restnode,
			player: LavalinkPlayer
		});
		this.client.emit('log', '[MUSIC] Manager hook has been enabled.');

		if (this.client.shard.id === 0) this.startAPI();

		const DBLAPI = new DBL(this.client.config.api.dbl.authKey, this.client);

		setInterval(() => {
			DBLAPI.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count);
		}, 1800000);

		setInterval(async () => {
			const serverCount = await this.client.shard.fetchClientValues('guilds.size').then(number => number.reduce((prev, val) => prev + val, 0));
			this.client.user.setPresence({ activity: { application: '353929487018229762', name: `${serverCount.toLocaleString()} guilds | https://sistine.ml/`, type: 3 } })
				.catch((err) => {
					this.client.emit('log', err, 'error');
				});
		}, 900000);
	}

};

