const { Finalizer } = require('klasa');

module.exports = class CMDStats extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: true
		});
	}

	run(msg, mes, stopwatch) {
		this.client.stats.histogram('command.process_time', stopwatch.end - stopwatch.start);
		this.client.stats.increment(`cmd.${msg.cmd.name}`);
		this.client.stats.increment('command.totalCommands');
	}

};
