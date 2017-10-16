const { Client, PermissionLevels } = require('klasa');
const Music = require('./util/lib/Music');
const keys = require('./keys.json');
const dashboardKeys = require('./dashboard.json');
const bans = require('./banlist.json');
const { StatsD } = require('node-dogstatsd');
const Raven = require('raven');

class SistineClient extends Client {

	constructor(options) {
		super(Object.assign(options));
		Object.defineProperty(this, 'keys', { value: keys });
		Object.defineProperty(this, 'dashKeys', { value: dashboardKeys });

		this.datadog = new StatsD();
		this.queue = new Music();
		this.banlist = bans;
		this.raven = Raven;
		this.site = null;
		this.sistinePermissionLevels = new PermissionLevels()
			.addLevel(0, false, () => true)
			.addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.DJRole && msg.member.roles.has(msg.guild.settings.DJRole))
			.addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.ModRole && msg.member.roles.has(msg.guild.settings.ModRole))
			.addLevel(3, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
			.addLevel(9, true, (client, msg) => msg.author === client.owner)
			.addLevel(10, false, (client, msg) => msg.author === client.owner);
	}

}

const Sistine = new SistineClient({
	clientOptions: { fetchAllMembers: true },
	prefix: 's>',
	cmdEditing: true,
	cmdLogging: true,
	typing: false,
	permissionLevels: this.sistinePermissionLevels,
	readyMessage: (client) => `Dev Mode: ${keys.dev ? 'On' : 'Off'} - ${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users.`
});

Sistine.login(keys.dev ? keys.betaBotToken : keys.botToken);
