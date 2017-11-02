const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class HugImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Want to hug another person?',
			usage: '[SomeoneToHug:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'hug') : msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'hugged');
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
