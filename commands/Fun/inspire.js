const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Quote extends Command {

	constructor(...args) {
		super(...args, { description: 'Fetches a famous quote and posts it.' });
	}

	async run(msg) {
		const req = await snek.get('https://talaikis.com/api/quotes/random/');
		const embed = new this.client.methods.Embed()
			.setTitle('Random Quote')
			.setColor('PURPLE')
			.setTimestamp()
			.setThumbnail('http://www.freeiconspng.com/uploads/quotes-png-11.png')
			.addField('\u200b', `${req.body.quote} – _${req.body.author}_`);
		return msg.channel.send({ embed });
	}

};
