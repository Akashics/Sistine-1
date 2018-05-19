const { Duration } = require('snekfetch');
const snekfetch = require('snekfetch');

class Util {

	/* eslint-disable camelcase */
	static async dBots(client) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
			.set({ Authorization: client.settings.apiTokens.discordbotsorg })
			.send({ server_count: client.guilds.size, shard_id: client.shard.id, shard_count: client.shard.count })
			.catch((err) => {
				client.console.error(`[DBOTS] Failed to post to Discord Bots. ${err}`);
			});
	}

	static async terminalINK(client) {
		const server_count = await client.shard.fetchClientValues('guilds.size').then(number => number.reduce((prev, val) => prev + val, 0));
		snekfetch
			.post(`https://ls.terminal.ink/api/v1/bots/${client.user.id}`)
			.set({ Authorization: client.settitngs.apiTokens.discordbotscouk })
			.send({ server_count })
			.catch((err) => {
				client.console.error(`[TerminalINK] Failed to post to ls.terminal.ink. ${err}`);
			});
	}

	static async discordbotWorld(client) {
		const server_count = await client.shard.fetchClientValues('guilds.size').then(number => number.reduce((prev, val) => prev + val, 0));
		snekfetch
			.post(`https://discordbot.world/api/bot/${client.user.id}/stats`)
			.set({ Authorization: client.settings.apiTokens.discordbotworld })
			.send({ server_count })
			.catch((err) => {
				client.console.error(`[DiscordBotWorld] Failed to post stats. ${err}`);
			});
	}

	static list(arr, conj = 'and') {
		const { length } = arr;
		return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	static splitText(str, length) {
		const textLength = str.substring(0, length).lastIndexOf(' ');
		const pos = textLength === -1 ? length : textLength;
		return str.substring(0, pos);
	}

	static showSeconds(duration) {
		return Duration.toNow(duration);
	}

	static async weebImage(msg, client, action) {
		const imageRequest = await snekfetch.get(`https://api.weeb.sh/images/random?type=${msg.command.name}`)
			.set('Authorization', `Bearer ${client.settings.apiTokens.weebservices}`)
			.catch(error => client.emit('error', `WEEBIMAGE: ${error}`));

		return new client.methods.Embed()
			.setColor('PURPLE')
			.setImage(imageRequest.body.url)
			.setDescription(action);
	}

	static async haste(input, extension) {
		return new Promise((res, rej) => {
			if (!input) rej('Input argument is required.');
			snekfetch.post('https://hastebin.com/documents').send(input).then(body => {
				res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ''}`);
			}).catch((error) => rej(error));
		});
	}

}

module.exports = Util;
