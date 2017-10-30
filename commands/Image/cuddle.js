const { Command } = require('klasa');
const axios = require('axios');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Allows you to cuddle with another user.',
			usage: '[SomeoneToCuddle:user]'
		});
	}

	async run(msg, [mention = msg.author]) {
		let userIsSelf = false;
		const { data } = await axios.get('https://staging.weeb.sh/images/random?type=cuddle', { headers: { Authorization: `Bearer ${this.client.keys.weebKey}` } });

		if (msg.author === mention) {
			userIsSelf = true;
		}
		const image = new this.client.methods.Embed()
			.setColor(msg.member.highestRole.color || 0)
			.setImage(data.url)
			.setDescription(userIsSelf ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'cuddle') : msg.language.get('USER_REACTION', msg.author.toString(), mention.toString(), 'cuddled'))
			.setFooter(msg.language.get('WEEB_SERVICES'));
		return msg.sendEmbed(image);
	}

};
