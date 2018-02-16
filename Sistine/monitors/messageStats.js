const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			ignoreBots: false,
			ignoreSelf: false,
			ignoreOthers: false,
			enabled: true
		});
	}

	async run() {
		const total = await this.client.providers.default.incrementValue('stats', 'ba598836-3e7f-4d46-a8f5-98a8613fe374', 'messages', 1);
		this.client.providers.default.update('stats', 'ba598836-3e7f-4d46-a8f5-98a8613fe374', { messages: total });
	}

};
