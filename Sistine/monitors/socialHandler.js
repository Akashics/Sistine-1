const { Monitor } = require('klasa');
const timeout = new Set();
module.exports = class socialMonitor extends Monitor {

	giveRandomPoints(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	async givePoints(msg) {
		if (msg.channel.type !== 'text' || msg.author.bot || !msg.guild) return;

		if (timeout.has(msg.author.id)) return;

		const userData = msg.author.configs;
		timeout.add(msg.author.id);
		const points = this.giveRandomPoints(1, 26);

		setTimeout(async () => {
			timeout.delete(msg.author.id);
			await userData.update('balance', userData.balance + points, msg.guild);
		}, 65000);

		const curLevel = Math.floor(0.2 * Math.sqrt(userData.balance + points));
		if (userData.level < curLevel) {
			userData.level = curLevel;
			await userData.update('level', userData.level, msg.guild);
		}
	}
	async run(msg) {
		await this.givePoints(msg);
	}

};
