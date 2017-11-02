const { Command } = require('klasa');

module.exports = class Echo extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 10,
			description: 'Says what you want to say. Deletes message if permission is available.',
			usage: '<WhatToSay:string>'
		});
	}

	async run(msg, [string]) {
		if (msg.content.endsWith('-s')) {
			try {
				msg.delete();
			} catch (error) {
				this.client.emit('error', error);
			}
		}
		return msg.send(string);
	}

};
