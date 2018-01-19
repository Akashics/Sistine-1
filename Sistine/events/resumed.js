const { Event } = require('klasa');
const webhook = require('../lib/managers/webhooks');

module.exports = class extends Event {

	run() {
		this.client.emit('error', `Connection resumed!`);
		webhook('[RESUMED] Sistine has successfully reconnected to the gateway.');
	}

};
