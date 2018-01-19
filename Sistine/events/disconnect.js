const { Event } = require('klasa');
const webhook = require('../lib/managers/webhooks');

module.exports = class extends Event {

	run(err) {
		this.client.emit('error', `Disconnected | ${err.code}: ${err.reason}`);
		webhook(`[DISCONNECTED] Error ${err.code}: Sistine was forcefully disconnected by external means.\nReason: ${err.reason}}`);
	}

};
