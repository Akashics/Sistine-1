const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(client, dir, file) {
		super(client, dir, file, { enabled: 'error' in client.config.consoleEvents ? !!client.config.consoleEvents.error : true });
		this.errFile = file;
		this.dirFile = dir;
	}

	run(err) {
		this.client.console.error(' ');
		this.client.console.error(`<!> NEW ERROR AT ${this.dirFile}/${this.errFile} <!>`);
		this.client.console.error(`${err}`);
		this.client.console.error(' ');
	}

};
