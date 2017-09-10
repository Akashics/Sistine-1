const { Event } = require('klasa');
const { sendStats } = require('../util/Util');

module.exports = class extends Event {

	run() {
		sendStats();
		async function createInterval() {
			this.interval = setInterval(() => {
				sendStats().then().catch((e) => {
					this.client.emit('log', e, 'error');
				});
			}, 1000 * 30);
		}
		createInterval();
		return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
			this.client.emit('log', err, 'error');
		});
	}

};