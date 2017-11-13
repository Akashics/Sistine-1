const { Finalizer } = require('klasa');
const now = require('performance-now');

module.exports = class CMDStats extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: true
		});
	}

	run(msg, mes, start) {
		this.client.stats.increment(`cmd.${msg.cmd.name}`);
		const time = start - now();
		this.client.stats.gauge('client.queryTime', time);
		this.client.stats.increment('client.totalCommands');
	}

};
