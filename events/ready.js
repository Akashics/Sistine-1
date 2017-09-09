const {
	Event
} = require('klasa');

module.exports = class extends Event {

	run() {
		return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
			this.client.emit('log', err, 'error');
		});
	}

};