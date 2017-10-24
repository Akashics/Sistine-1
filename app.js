const { Client, PermissionLevels } = require('klasa');
const Music = require('./util/lib/Music');
const keys = require('./keys/keys.json');
const dashboardKeys = require('./keys/dashboard.json');
const StatsD = require('hot-shots');
const datadog = new StatsD();
require('./jamesbond');

class SistineClient extends Client {

	constructor(options) {
		super(Object.assign(options));
		Object.defineProperty(this, 'keys', { value: keys });
		Object.defineProperty(this, 'dashKeys', { value: dashboardKeys });

		this.stats = datadog;
		this.raven = require('raven');
		this.queue = new Music();
		this.whitelist = require('./keys/whitelist.json');
		this.blocklist = require('./keys/blocklist.json');
		this.blacklist = require('./keys/blacklist.json');
		// Dashboard
		this.site = null;
		// Permission Levels
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
	cmdLogging: false,
	typing: false,
	permissionLevels: this.sistinePermissionLevels,
	readyMessage: (client) => `${keys.dev ? '!== DEV MODE ONLINE ==! - ' : ''}${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users.`
});

Sistine.login(keys.dev ? keys.betaBotToken : keys.botToken);


datadog.socket.on('error', (error) => {
	console.error('Error in socket: ', error);
});
