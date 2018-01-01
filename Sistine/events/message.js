const { Event } = require('klasa');

module.exports = class extends Event {

	run(msg) {
		if (!this.client.ready) return;
		this.client.status.increment('client.messages');
		this.client.monitors.run(msg);
	}

};
