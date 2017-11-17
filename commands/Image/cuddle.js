const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class Cuddle extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Allows you to cuddle with another user.',
			usage: '[SomeoneToCuddle:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		var action;
		if (mentioned === msg.author) {
			action = msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'cuddle');
		} else {
			action = msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'cuddled');
		}
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
