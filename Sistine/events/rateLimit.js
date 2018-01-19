const { Event } = require('klasa');
const webhook = require('../lib/managers/webhooks');

module.exports = class extends Event {

	run(rateLimit) {
		this.client.emit('error', `[RATELIMITED] Client has hit the limit! Timeout: ${rateLimit.timeout} Limit: ${rateLimit.limit}`);
		webhook(`[RATELIMITED] Sistine reached a rate limit! Timeout: ${rateLimit.timeout} Limit: ${rateLimit.limit}`);
	}

};
