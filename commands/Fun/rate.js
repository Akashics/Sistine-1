const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['rate-waifu'],
			description: 'Rates your Waifu!',
			usage: '<Query:Str>'
		});
		this.cost = 1;
	}

	async run(msg, [user]) {
		let rate;

		if (/^(you|yourself|sistine|kashall|kash|jordan|lili)$/i.test(user)) {
			rate = 100;
			return msg.send(`Honestly, ${msg.author.username}, I would have to give ${user} a ${rate}/100! C:`);
		} else {
			if (/^(myself|me)$/i.test(user)) user = msg.author.username;
			else user = user.replace(/\bmy\b/g, 'your');

			const bg = Buffer.from(user.toLowerCase()).readUIntBE(0, user.length);
			const rng = user.length * Math.abs(Math.sin(bg)) * 10;
			rate = 100 - Math.round((bg * rng) % 100);
			// ratewaifu = oneToTen(Math.floor(rate / 10)).emoji;
		}
		return msg.send(`If anything, ${msg.author.username}, I would have to give ${user} a ${rate}/100. :O`);
		// msg.language.get('COMMAND_RATE', user, rate, ratewaifu));
	}

};
