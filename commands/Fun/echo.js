const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			permLevel: 10,
			description: 'Says what you want to say. Deletes message if permission is available.',
			usage: '<WhatToSay:string>'
		});
	}

	async run(msg, [...args]) {
		if (msg.deletable) {
			msg.delete();
		}
		return msg.send(args);
	}

};
