const { Command } = require('klasa');

module.exports = class Clap extends Command {

	constructor(...args) {
		super(...args, {
			botPerms: ['SEND_MESSAGES'],
			description: 'Y O U C A N D O T H I S',
			usage: '<text:string{1,100}>'
		});
	}

	async run(msg, [text]) {
		return msg.channel.send(text.split(' ').join(':clap:'));
	}

};
