const { Command } = require('klasa');
const axios = require('axios');

module.exports = class Quote extends Command {

	constructor(...args) {
		super(...args, { description: 'Fetches a famous quote and posts it.' });
	}

	async run(msg) {
		const req = await axios.get('https://talaikis.com/api/quotes/random/');
		const embed = new this.client.methods.Embed()
			.setTitle('Random Quote')
			.setColor('PURPLE')
			.setTimestamp()
			.setDescription(`_Requested by ${msg.author.tag}_`)
			.setThumbnail('http://www.freeiconspng.com/uploads/quotes-png-11.png')
			.addField('\u200b', `${req.data.quote} – _${req.data.author}_`);
		return msg.channel.send({ embed });
	}

};
