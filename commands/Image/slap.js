const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class SlapImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to slap another member.',
			usage: '[SomeoneToSlap:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		var action;
		if (mentioned === msg.author) {
			action = msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'be slapped. uwu');
		} else {
			action = msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'slapped');
		}
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
