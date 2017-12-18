const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Fortune extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Give a number, get a fact!',
			usage: '[trivia|math|year] <Number:int>',
			enabled: false
		});
	}

	async run(msg, [type = 'year', number]) {
		// http://numbersapi.com/918204/year?json
		const { body } = await snek.get(`http://numbersapi.com/${number}/${type}?json`);
		const finalmsg = new this.client.methods.Embed()
			.setTitle('Number Facts')
			.setColor('PURPLE')
			.setTimestamp()
			.setThumbnail('http://www.emoji.co.uk/files/twitter-emojis/symbols-twitter/11192-input-symbol-for-numbers.png')
			.addField('\u200b', `${body.text}`);
		return msg.channel.send({ embed: finalmsg });
	}

};
