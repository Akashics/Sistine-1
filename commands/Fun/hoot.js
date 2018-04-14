const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Cat extends Command {

	constructor(...args) {
		super(...args, {
			botPerms: ['SEND_MESSAGE'],
			description: 'Speak in OWL.',
			usage: '<text:string{1,500}>'
		});
	}

	async run(msg, [text]) {
		const hooted = text.replace(/\b[^\d\W]+\b/g, 'hoot');
		return msg.channel.send(hooted);
	}

};
