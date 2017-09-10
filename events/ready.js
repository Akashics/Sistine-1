const { Event } = require('klasa');
const { sendStats } = require('../util/Util');

module.exports = class extends Event {

	run() {
		sendStats();
		createInterval() {
			this.interval = setInterval(() => {
				sendStats().then().catch(e => {
					console.error(e);
				});
			}, 1000 * 30);
		}
		return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
			this.client.emit('log', err, 'error');
		});
	}

};