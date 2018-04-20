const { APIServer } = require('http-nextra');
const { isFunction } = require('klasa').util;

class DashboardHook extends APIServer {

	constructor(client, options = { port: 6565 }) {
		super(async (request, response) => {
			if (!await this.router.runPath(request.url.slice(1).split('/'), request, response, {})) {
				response.end('Endpoint not found. Try reading the manual next time.');
			}
		});

		this.client = client;

		this.router.get('commands', (request, response) => {
			response.writeHead(200, { 'Content-Type': 'application/json' });

			const commands = {};
			const msg = { language: this.client.languages.default };
			this.client.commands.filter(cmd => cmd.permLevel <= 6).forEach(cmd => {
				if (!commands.hasOwnProperty(cmd.category)) commands[cmd.category] = [];

				commands[cmd.category].push({
					name: cmd.name,
					aliases: cmd.aliases,
					description: isFunction(cmd.description) ? cmd.description(msg) : cmd.description,
					extendedHelp: isFunction(cmd.extendedHelp) ? cmd.extendedHelp(msg) : cmd.extendedHelp,
					botPerms: cmd.botPerms,
					category: cmd.catergory,
					cooldown: {
						usages: cmd.bucket,
						duration: cmd.cooldown
					},
					deletable: cmd.deletable,
					enabled: cmd.enabled,
					nsfw: cmd.nsfw,
					permLevel: cmd.permLevel,
					requiredConfigs: cmd.requiredConfigs,
					runIn: cmd.runIn,
					usage: cmd.usage.nearlyFullUsage
				});
			});
			return response.end(JSON.stringify(commands));
		});

		this.router.get('stats', async (request, response) => {
			response.writeHead(200, { 'Content-Type': 'application/json' });

			const guilds = (await this.client.shard.fetchClientValues('guilds.size')).reduce((prev, val) => prev + val, 0);
			const users = (await this.client.shard.fetchClientValues('users.size')).reduce((prev, val) => prev + val, 0);
			const textChannels = (await this.client.shard.fetchClientValues('channels.size')).reduce((prev, val) => prev + val, 0);
			const voiceChannels = (await this.client.shard.fetchClientValues('voiceConnections.size')).reduce((prev, val) => prev + val, 0);

			const { executions, messages } = this.client.configs;
			const { ping, status, uptime } = this.client;
			const shard = this.client.shard.count;
			const memory = process.memoryUsage().heapUsed / 1024 / 1024;
			return response.end(JSON.stringify({ shard, status, ping, uptime, memory, guilds, users, textChannels, voiceChannels, executions, messages, version: 'v2', nodeVersion: process.nodeVersion }));
		});

		this.router.get('guilds', (request, response) => response.end(JSON.stringify(this.client.guilds.keyArray())));

		this.router.get('guilds/:guildID', async (request, response, { guildID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) response.end('{}');
			return response.end(JSON.stringify(guild));
		});

		this.router.get('guilds/:guildID/config/reset', async (request, response, { guildID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) return response.end('{ "success": false }');
			await guild.configs.reset();
			return response.end(JSON.stringify({ success: true }));
		});

		this.router.get('guilds/:guildID/members', async (request, response, { guildID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) response.end('[]');
			return response.end(JSON.stringify(guild.members.keyArray()));
		});

		this.router.get('guilds/:guildID/members/:memberID', async (request, response, { guildID, memberID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) return response.end('{}');
			const member = guild.members.get(memberID);
			if (!member || member === null) return response.end('{}');
			const manage = member.permissions.has('MANAGE_GUILD');
			return response.end(JSON.stringify(member, manage));
		});

		this.router.get('guilds/:guildID/members/:memberID/manager', async (request, response, { guildID, memberID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) return response.end('{}');
			const member = guild.members.get(memberID);
			if (!member || member === null) return response.end('{}');
			const manage = member.permissions.has('MANAGE_GUILD');
			return response.end(JSON.stringify(manage));
		});

		this.router.get('guilds/:guildID/roles', async (request, response, { guildID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) response.end('[]');
			return response.end(JSON.stringify(guild.roles.keyArray()));
		});

		this.router.get('guilds/:guildID/roles/:roleID', async (request, response, { guildID, roleID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) return response.end('{}');
			const role = guild.members.get(roleID);
			if (!role) return response.end('{}');
			return response.end(JSON.stringify(role));
		});

		this.router.get('guilds/:guildID/channels', async (request, response, { guildID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) response.end('[]');
			return response.end(JSON.stringify(guild.channels.keyArray()));
		});

		this.router.get('guilds/:guildID/channels/:channelID', async (request, response, { guildID, channelID }) => {
			const guild = await this.client.guilds.get(guildID);
			if (!guild || guild === null) return response.end('{}');
			const channel = guild.members.get(channelID);
			if (!channel) return response.end('{}');
			return response.end(JSON.stringify(channel));
		});

		for (const [name, store] of this.client.pieceStores) {
			this.router.get(`${name}/`, (request, response) => response.end(JSON.stringify(store.keyArray())));

			this.router.get(`${name}/:id`, (request, response, { id }) => {
				const piece = store.get(id);
				if (!piece) response.end('{}');
				return response.end(JSON.stringify(piece));
			});
		}

		this.listen(options.port, () => this.client.emit('log', `[API] Started on port ${options.port}.`));
	}

}

module.exports = DashboardHook;
