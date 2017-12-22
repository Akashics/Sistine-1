const { Event } = require('klasa');

module.exports = class Message extends Event {

	async run(msg) {
		if (!this.client.ready) return;

		if (this.client.blocklist.includes(msg.author.id)) return;
		this.client.stats.increment('client.messages');
		this.client.monitors.run(msg);
	}

};
