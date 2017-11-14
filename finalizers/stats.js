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
		console.log('Testing Finalizer');
		this.client.stats.histogram('command.process_time', now() - start);
		this.client.stats.increment(`cmd.${msg.cmd.name}`);
		this.client.stats.increment('client.totalCommands');
		console.log('Testing Finalizer END');
	}

};
