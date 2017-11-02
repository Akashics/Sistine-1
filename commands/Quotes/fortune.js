const { Command } = require('klasa');
const axios = require('axios');

module.exports = class Fortune extends Command {

	constructor(...args) {
		super(...args, { description: 'Gets your fortune cookie.' });
	}

	async run(msg) {
		const req = await axios.get('http://www.yerkee.com/api/fortune');
		const finalmsg = new this.client.methods.Embed()
			.setTitle('Random Fortune')
			.setColor(msg.member.highestRole.color || 0)
			.setTimestamp()
			.setDescription(`_Requested by ${msg.author.tag}_`)
			.setThumbnail('https://vignette4.wikia.nocookie.net/clubpenguin/images/b/bc/Emoticons_Fortune_Cookie_Card_Jitsu_Party_2013.png/revision/latest?cb=20130524131112')
			.addField('\u200b', `${req.data.fortune}`);
		return msg.channel.send({ embed: finalmsg });
	}

};
