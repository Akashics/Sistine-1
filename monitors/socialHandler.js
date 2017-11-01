const { Monitor } = require('klasa');
const timeout = new Set();
module.exports = class extends Monitor {

	giveRandomPoints(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	async givePoints(message) { // eslint-disable-line no-unused-vars
		if (message.channel.type !== 'text' || message.author.bot || !message.guild) return;
		const timedOut = timeout.has(message.author.id);
		if (timedOut) return;
		const { users } = this.client.settings;
		const score = await users.fetchEntry(message.author.id);
		timeout.add(message.author.id);
		const points = this.giveRandomPoints(5, 13);
		setTimeout(async () => {
			timeout.delete(message.author.id);
			await users.updateOne(message.author.id, 'balance', score.balance + points, message.guild);
		}, 45000);

		const curLevel = Math.floor(0.2 * Math.sqrt(score.balance + points));
		if (score.level < curLevel) {
			score.level = curLevel;
			await users.updateOne(message.author.id, 'level', score.level, message.guild);
		}
		// DEBUG ONLY: console.log(`${message.author.tag}`, score);
	}
	async run(msg) {
		await this.givePoints(msg);
	}

};
