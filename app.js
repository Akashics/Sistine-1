const { Client } = require('klasa');
const MusicManager = require('./lib/structures/MusicManager');
const { ClientOptions } = require('./lib/util/Constants');
const config = require('./config.json');

Client.defaultPermissionLevels
	.add(1, (client, msg) => msg.guild && msg.guild.configs.roles.musicdj && msg.member.roles.has(msg.guild.configs.roles.musicdj))
	.add(2, (client, msg) => msg.guild && msg.guild.configs.roles.moderator && msg.member.roles.has(msg.guild.configs.roles.moderator))
	.add(8, (client, msg) => config.users.assistantDevs.includes(msg.author.id));

class SistineClient extends Client {

	constructor() {
		super({ ...ClientOptions });

		Object.defineProperty(this, 'config', { value: config });
		this.music = new MusicManager(this);
		this.lavalink = require('./lib/structures/LavalinkClient');
		this.guildsWebhook = new this.methods.Webhook(config.webhook.id, config.webhook.token);
		this.health = { commands: { count: 0, ran: {} } };
		this.wait = require('util').promisify(setTimeout);
	}

}
new SistineClient().login(config.token);
