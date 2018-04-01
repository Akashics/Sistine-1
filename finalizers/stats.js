const { Finalizer } = require('klasa');

module.exports = class CMDStats extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: true
		});
	}

	async run(msg, mes, stopwatch) {
		this.client.configs.update('executions', this.client.configs.executions + 1, msg.guild);
	}

};
