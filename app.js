const { Client, PermissionLevels } = require('klasa');
const Music = require('./util/lib/Music');
const keys = require('./keys/keys.json');
const StatsD = require('hot-shots');
require('./jamesbond');

class SistineClient extends Client {

	constructor(options) {
		super(Object.assign(options));
		Object.defineProperty(this, 'keys', { value: keys });

		this.stats = new StatsD();
		this.raven = require('raven');
		this.queue = new Music();
		this.whitelist = require('./keys/whitelist.json');
		this.blocklist = require('./keys/blocklist.json');
		this.blacklist = require('./keys/blacklist.json');
		this.wait = require('util').promisify(setTimeout);
		this.sistinePermissionLevels = new PermissionLevels()
			.addLevel(0, false, () => true)
			.addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.roles.musicdj && msg.member.roles.has(msg.guild.settings.roles.musicdj))
			.addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.roles.moderator && msg.member.roles.has(msg.guild.settings.roles.moderator))
			.addLevel(3, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
			.addLevel(9, true, (client, msg) => msg.author === client.owner)
			.addLevel(10, false, (client, msg) => msg.author === client.owner);
	}

}

const Sistine = new SistineClient({
	clientOptions: { fetchAllMembers: true },
	prefix: ['s>', 'S>'],
	cmdEditing: true,
	cmdLogging: true,
	typing: false,
	permissionLevels: this.sistinePermissionLevels,
	readyMessage: (client) => `${client.user.tag}, Ready to serve ${client.guilds.size} guilds and ${client.users.size} users.`,
	provider: { engine: 'rethinkdb' },
	console: { useColor: true }
});

Sistine.login(keys.botToken);

Sistine.stats.socket.on('error', (error) => {
	Sistine.emit('error', `Error in Socket:\n ${error}`);
});

process.on('unhandledRejection', error => {
	Sistine.emit('error', `Uncaught Promise Error:\n ${error}`);
});

String.prototype.toProperCase = function prop() {
	return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
