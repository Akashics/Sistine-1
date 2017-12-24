const { Client, PermissionLevels } = require('klasa');
const Music = require('./lib/managers/Music');
const { botToken } = require('./config.json');
const StatsD = require('hot-shots');

class SistineClient extends Client {

	constructor(options) {
		super(Object.assign(options));

		this.stats = new StatsD();
		this.queue = new Music();
		this.raven = require('raven');

		this.whitelist = require('./lists/whitelist.json');
		this.blocklist = require('./lists/blocklist.json');
		this.blacklist = require('./lists/blacklist.json');

		this.wait = require('util').promisify(setTimeout);
		this.permlevel = new PermissionLevels()
			.addLevel(0, false, () => true)
			.addLevel(1, false, (client, msg) => msg.guild && msg.guild.configs.roles.musicdj && msg.member.roles.has(msg.guild.configs.roles.musicdj))
			.addLevel(2, false, (client, msg) => msg.guild && msg.guild.configs.roles.moderator && msg.member.roles.has(msg.guild.configs.roles.moderator))
			.addLevel(3, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
			.addLevel(9, true, (client, msg) => msg.author === client.owner)
			.addLevel(10, false, (client, msg) => msg.author === client.owner);
	}

}

const Sistine = new SistineClient({
	clientOptions: {
		fetchAllMembers: true,
		disableEveryone: true
	},
	cmdDeleting: true,
	cmdEditing: true,
	typing: false,
	cmdLogging: true,
	language: 'en-US',
	prefix: 's>',
	permissionLevels: this.permlevel,
	readyMessage: (client) => `${client.user.tag}-${client.shard.id}, Listening to ${client.guilds.size} guilds, ${client.users.size} users, ${client.channels.size} channels.`,
	provider: { engine: 'rethinkdb' },
	console: { useColor: true, timestamps: 'MM-DD-YYYY hh:mm:ss A' }
});

process.on('unhandledRejection', error => {
	Sistine.emit('error', `Uncaught Promise Error:\n ${error}.`);
});

process.on('uncaughtException', error => {
	Sistine.emit('error', `Uncaught Exception Error:\n ${error}.`);
});

Sistine.login(botToken);
