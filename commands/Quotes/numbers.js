const { Command } = require('klasa');
const axios = require('axios');

module.exports = class Fortune extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Give a number, get a fact!',
			usage: '<trivia|math|year> <Number:int>'
		});
	}

	async run(msg, [type, number]) {
		const req = await axios.get(`http://numbersapi.com/${number}/${type}`);
		const finalmsg = new this.client.methods.Embed()
			.setTitle('Number Facts')
			.setColor('PURPLE')
			.setTimestamp()
			.setDescription(`_Requested by ${msg.author.tag}_`)
			.setThumbnail('https://vignette4.wikia.nocookie.net/clubpenguin/images/b/bc/Emoticons_Fortune_Cookie_Card_Jitsu_Party_2013.png/revision/latest?cb=20130524131112')
			.addField('\u200b', `${req.data.fortune}`);
		return msg.channel.send({ embed: finalmsg });
	}

};
