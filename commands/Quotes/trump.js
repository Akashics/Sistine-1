const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'trump',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Lets trump it up!',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg) {
		const req = await axios.get('https://api.whatdoestrumpthink.com/api/v1/quotes/random');
		const embed = new this.client.methods.Embed()
			.setTitle('Random Trump Quote')
			.setColor(msg.member.highestRole.color || 0)
			.setTimestamp()
			.setDescription(`_Requested by ${msg.author.tag}_`)
			.setThumbnail('https://www.bloomberg.com/graphics/2017-comey-vs-trump/img/trump.png')
			.addField('\u200b', `${req.data.message}`);
		return msg.channel.send({ embed });
	}

};
