const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['rate'],
			description: 'Rates your Waifu!',
			usage: '<Waifu:Str>'
		});
	}

	async run(msg, args) {
		return msg.send(msg.language.get('RATE_WAIFU', args[0], Math.floor(Math.random() * 10) + 1));
	}

};
