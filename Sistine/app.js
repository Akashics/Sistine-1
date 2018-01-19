const { Client } = require('klasa');
const Music = require('./lib/managers/Music');
const { botToken, rethinkdb } = require('./config.json');
const webhook = require('./lib/managers/webhooks');
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
		disabledEvents: [
			'GUILD_BAN_ADD',
			'GUILD_BAN_REMOVE',
			'TYPING_START',
			'TYPING_STOP',
			'RELATIONSHIP_ADD',
			'RELATIONSHIP_REMOVE',
			'CHANNEL_PINS_UPDATE',
			'PRESENCE_UPDATE',
			'USER_UPDATE',
			'USER_NOTE_UPDATE',
			'MESSAGE_REACTION_ADD',
			'MESSAGE_REACTION_REMOVE',
			'MESSAGE_REACTION_REMOVE_ALL'
		],
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
	providers: {
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

process.on('exit', () => {
	webhook('[EXITING] Sistine is now exiting (might be restarting?).');
});

Sistine.login(botToken);
