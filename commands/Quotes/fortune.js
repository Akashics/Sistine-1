const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'fortune',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Gets your fortune cookie.',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg) {

		let req = await axios.get('http://www.yerkee.com/api/fortune');
		const embed = new this.client.methods.Embed()
			.setTitle('Random Fortune')
			.setColor(msg.guild.member(client.user.id).highestRole.color || 0)
			.setTimestamp()
			.setDescription('_Requested by ' + msg.author.tag + '_')
			.setThumbnail('https://vignette4.wikia.nocookie.net/clubpenguin/images/b/bc/Emoticons_Fortune_Cookie_Card_Jitsu_Party_2013.png/revision/latest?cb=20130524131112')
			.addField('\u200b', `${req.data.fortune}`);
		return msg.channel.send({ embed: embed });

	}

};