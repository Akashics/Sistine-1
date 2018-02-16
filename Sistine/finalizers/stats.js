const { Finalizer } = require('klasa');

module.exports = class CMDStats extends Finalizer {

	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: true
		});
	}

	async run(msg, mes, stopwatch) {
		this.client.stats.histogram('command.process_time', stopwatch.end - stopwatch.start);
		this.client.stats.increment(`cmd.${msg.command.name}`);
		this.client.stats.increment('command.totalCommands');

		const total = await this.client.providers.default.incrementValue('stats', 'ba598836-3e7f-4d46-a8f5-98a8613fe374', 'commands', 1);
		this.client.providers.default.update('stats', 'ba598836-3e7f-4d46-a8f5-98a8613fe374', { commands: total });
	}

};
