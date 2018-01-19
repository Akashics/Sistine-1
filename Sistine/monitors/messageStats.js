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
		const total = await this.client.providers.default.incrementValue('stats', '45cfe4d5-7901-4b3e-94ee-1c951a230f25', 'messages', 1);
		this.client.providers.default.update('stats', '45cfe4d5-7901-4b3e-94ee-1c951a230f25', { messages: total });
	}

};
