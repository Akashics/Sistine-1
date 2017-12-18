const { Event } = require('klasa');

module.exports = class Error extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: client.options.consoleEvents.error });
		this.errFile = file;
	}

	run(err) {
		this.client.stats.increment('client.error');
		this.client.console.error('');
		this.client.console.error(`New Error in ${this.errFile} || ${err}`);
	}

};
