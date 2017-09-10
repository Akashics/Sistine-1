const { Command } = require('klasa');
const axios = require('axios');
const { weebKey } = require('../../keys.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'hug',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Allows you to hug another member!',
			usage: '<SomeoneToHug:member>',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg, [...args]) {

		const image = new this.client.methods.Embed();
		const AuthStr = 'Bearer ' + weebKey;

		var self = false;
		var imageRequest = await axios.get('https://staging.weeb.sh/images/random?type=hug', { headers: { Authorization: AuthStr } });
 
		if (msg.author.id === args[0].user.id) {
			self = true;
		}
		image
			.setColor(msg.guild.member(msg.author.id).highestRole.color || 0)
			.setImage(imageRequest.data.url)
			.setDescription(self ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'hug') : msg.language.get('USER_REACTION', msg.author.toString(), args[0].user.toString(), 'hugged'))
			.setFooter(msg.language.get('WEEB_SERVICES'));

		return msg.send('', {embed: image});
        
	}

};