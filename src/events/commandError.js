const { Event, util: { codeBlock } } = require('klasa');

module.exports = class commandErrorEvent extends Event {

	/* eslint-disable max-len */
	async run(msg, command, params, error) {
		if (typeof error !== 'string') this.client.console.wtf(`[COMMAND] ${command.category}:${command.name}\n${error.stack || error.message || error}`);
		if (error.message) {
			return msg.sendMessage(`There has been an error while running the command, Try again and if the problem incurs again contact ${this.client.owner.tag}\n${codeBlock('json', error.message)}`)
				.catch(err => this.client.emit('wtf', err));
		}
		if (typeof error === 'string') return msg.send(error);
		return msg.sendMessage(`There has been an error while running the command, Try again and if the problem incurs again contact ${this.client.owner.tag}`).catch(err => this.client.emit('wtf', err));
	}

};
