const { Event } = require('klasa');

module.exports = class extends Event {

	run() {
		this.client.dogstatsd.increment('prod.messages');
	}

};