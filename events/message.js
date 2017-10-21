const { Event } = require('klasa');

module.exports = class extends Event {

	async run(msg) {
		if (this.client.ready) {
			this.client.datadog.increment('client.messages');
			this.client.monitors.run(msg);
		}
	}

};
