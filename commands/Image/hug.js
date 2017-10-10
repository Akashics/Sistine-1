const { Command } = require('klasa');
const axios = require('axios');
const { weebKey } = require('../../keys.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Want to hug another person?',
			usage: '<SomeoneToHug:member>'
		});
	}

	async run(msg, [...args]) {
		const AuthStr = `Bearer ${weebKey}`;

		let self = false;
		const imageRequest = await axios.get('https://staging.weeb.sh/images/random?type=hug', { headers: { Authorization: AuthStr } });

		if (msg.author.id === args[0].user.id) {
			self = true;
		}
		const image = new this.client.methods.Embed()
			.setColor(msg.guild.member(msg.author.id).highestRole.color || 0)
			.setImage(imageRequest.data.url)
			.setDescription(self ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'hug') : msg.language.get('USER_REACTION', msg.author.toString(), args[0].user.toString(), 'hugged'))
			.setFooter(msg.language.get('WEEB_SERVICES'));

		return msg.send('', { embed: image });
	}

};
