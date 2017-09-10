const moment = require('moment');
require('moment-duration-format');
const snekfetch = require('snekfetch');
const keys = require('../keys.json');

class Util {
	/* eslint-disable no-console */
	static dBots(count, id) {
		snekfetch
			.post(`https://bots.discord.pw/api/bots/${id}/stats`)
			.set({
				Authorization: keys.apiKey.dBotsPW
			})
			.send({
				server_count: count
			})
			.then(() => {
				console.log('[DBOTS] Successfully posted to Discord Bots.');
			})
			.catch((err) => {
				console.log(`[DBOTS] Failed to post to Discord Bots. ${err}`);
			});
	}

	static dBotsOrg(count, id) {
		snekfetch
			.post(`https://discordbots.org/api/bots/${id}/stats`)
			.set({
				Authorization: keys.apiKey.dBotsORG
			})
			.send({
				server_count: count
			})
			.then(() => {
				console.log('[DBOTSORG] Successfully posted to Discord Bots Org.');
			})
			.catch((err) => {
				console.log(`[DBOTSORG] Failed to post to Discord Bots Org. ${err}`);
			});
	}
	
	static sendStats(client) {
		const dd = client.dogstatsd;

		dd.gauge('client.ping', client.ping);
		dd.gauge('client.guilds', client.guilds.size);
		dd.gauge('client.users', client.guilds.reduce((a, b) => a + b.memberCount, 0));
		dd.gauge('client.channels', client.channels.size);
		dd.gauge('node.memory', (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
		dd.gauge('client.voice', client.voiceConnections.size);
		
	}

	static list(arr, conj = 'and') {
		const { length } = arr;
		return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
	}

	/**
	 * Split a string by its latest space character in a range from the character 0 to the selected one.
	 * @param {string} str    The text to split.
	 * @param {number} length The length of the desired string.
	 * @returns {string}
	 * @static
	 */
	static splitText(str, length) {
		const x = str.substring(0, length).lastIndexOf(' ');
		const pos = x === -1 ? length : x;
		return str.substring(0, pos);
	}

	/**
	 * Show time duration in an un-trimmed h:mm:ss format.
	 * @param {number} duration Duration in milliseconds.
	 * @returns {string}
	 */
	static showSeconds(duration) {
		return moment.duration(duration).format('h:mm:ss', {
			trim: false
		});
	}

}

module.exports = Util;