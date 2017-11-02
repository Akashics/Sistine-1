const { Event } = require('klasa');

module.exports = class Error extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'error' in client.config.consoleEvents ? !!client.config.consoleEvents.error : true });
		this.errFile = file;
		this.dirFile = dir;
	}

	run(err) {
		this.client.console.error(' ');
		this.client.console.error(`<!> New Error: ${this.errFile} <!>`);
		this.client.console.error(`${err}`);
	}

};
