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

		const total = await this.client.providers.default.incrementValue('stats', '45cfe4d5-7901-4b3e-94ee-1c951a230f25', 'commands', 1);
		this.client.providers.default.update('stats', '45cfe4d5-7901-4b3e-94ee-1c951a230f25', { commands: total });
	}

};
