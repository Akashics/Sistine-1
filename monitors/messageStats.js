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

	async run(msg) {
		this.client.configs.update('messages', this.client.configs.messages + 1, msg.guild);
	}

};
