const { Client, PermissionLevels } = require('klasa');
const path = require('path');
const { Collection, Webhook } = require('discord.js');
const MusicManager = require('./lib/structures/MusicManager');
const AFK = require('./lib/structures/afk');
const { ClientOptions } = require('./lib/util/Constants');
const IdioticClient = require('./lib/structures/IdioticClient');
const config = require('../config.json');

const devs = [
	'201077739589992448',
	'126321762483830785'
];

const permissionLevels = new PermissionLevels()
	.add(0, () => true)
	.add(2, (client, msg) => {
		if (!msg.guild || msg.member) return false;
		const djRoleId = msg.guild.configs.roles.dj;
		return djRoleId && msg.member.roles.has(djRoleId);
	}, { fetch: true })
	.add(4, (client, msg) => {
		if (!msg.guild || msg.member) return false;
		const modRoleId = msg.guild.configs.roles.mod;
		return modRoleId && msg.member.roles.has(modRoleId);
	}, { fetch: true })
	.add(5, (client, msg) => {
		if (!msg.guild || !msg.member) return false;
		const adminRoleId = msg.guild.configs.roles.admin;
		return adminRoleId && msg.member.roles.has(adminRoleId);
	}, { fetch: true })
	.add(6, (client, msg) => msg.guild && msg.member && msg.member.permissions.has('MANAGE_GUILD'), { fetch: true })
	.add(7, (client, msg) => msg.guild && msg.member && msg.member === msg.guild.owner, { fetch: true })
	.add(9, (client, msg) => devs.includes(msg.author.id), { break: true })
	.add(10, (client, msg) => devs.includes(msg.author.id));

class SistineClient extends Client {

	constructor() {
		super({ ...ClientOptions, permissionLevels });

		Object.defineProperty(this, 'config', { value: config });
		this.clientBaseDir = path.resolve('src');
		this.music = new MusicManager(this);
		this.ramStat = new Array(60);
		this.cmdStat = new Array(60);
		this.lavalink = require('./lib/structures/LavalinkClient');
		this.idioticApi = new IdioticClient(config.api.idioticapi);
		this.webhook = new Webhook(config.webhook.id, config.webhook.token);
		this.wait = require('util').promisify(setTimeout);
		this.afks = new AFK(this);
		this.executedCommands = new Collection();
	}

}

SistineClient.token = config.token;

module.exports = SistineClient;
