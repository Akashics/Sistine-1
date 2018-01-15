const { Client } = require('klasa');
const Music = require('./lib/managers/Music');
const { botToken, rethinkdb } = require('./config.json');
const StatsD = require('hot-shots');

Client.defaultPermissionLevels
	.addLevel(1, false, (client, msg) => msg.guild && msg.guild.configs.roles.musicdj && msg.member.roles.has(msg.guild.configs.roles.musicdj))
	.addLevel(2, false, (client, msg) => msg.guild && msg.guild.configs.roles.moderator && msg.member.roles.has(msg.guild.configs.roles.moderator));

class SistineClient extends Client {

	constructor(options) {
		super(Object.assign(options));

		this.stats = new StatsD();
		this.queue = new Music();
		this.raven = require('raven');
		this.wait = require('util').promisify(setTimeout);
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
	pieceDefaults: { commands: { deletable: true } },
	readyMessage: (client) => `${client.user.tag}-${client.shard.id}, Listening to ${client.guilds.size} guilds, ${client.users.size} users, ${client.channels.size} channels.`,
	provider: {
		default: 'rethinkdb',
		rethink: {
			host: rethinkdb.host,
			port: rethinkdb.port,
			user: rethinkdb.user,
			password: rethinkdb.password,
			db: rethinkdb.database,
			silent: true,
			pool: true,
			timeout: 30
		}
	},
	console: { useColor: true, timestamps: 'MM-DD-YYYY hh:mm:ss A' }
});

process.on('unhandledRejection', error => {
	Sistine.emit('error', `Uncaught Promise Error:\n ${error}.`);
});

process.on('uncaughtException', error => {
	Sistine.emit('error', `Uncaught Exception Error:\n ${error}.`);
});

Sistine.login(botToken);
