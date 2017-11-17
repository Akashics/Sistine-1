const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class KissImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to kiss another user.',
			usage: '[SomeoneToKiss:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		var action;
		if (mentioned === msg.author) {
			action = msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'kiss');
		} else {
			action = msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'kissed');
		}
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
