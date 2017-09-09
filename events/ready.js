const {
	Event
} = require('klasa');

module.exports = class extends Event {

	run() {
		return this.client.user.setGame(`s>help / ${this.client.guilds.size}`).catch((err) => {
			this.client.emit('log', err, 'error')
		});
	}

};