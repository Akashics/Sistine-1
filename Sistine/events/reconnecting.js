const { Event } = require('klasa');
const webhook = require('../lib/managers/webhooks');

module.exports = class extends Event {

	run() {
		this.client.emit('error', `Reconnecting...`);
		webhook('[RECONNECTING] Sistine is attempting to reconnect...');
	}

};
