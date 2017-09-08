const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'rate-waifu',
			enabled: false,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['waifu'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Rates your Waifu!',
			usage: '<Waifu:Str>',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg, args) {

		const { waifu } = args;
		    return msg.send(msg.language.get('RATE_WAIFU', waifu, Math.floor(Math.random() * 10) + 1));
	}

};