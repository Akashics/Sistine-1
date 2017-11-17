const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class PatImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to pat another member.',
			usage: '[SomeoneToPat:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		var action;
		if (mentioned === msg.author) {
			action = msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'head-pat');
		} else {
			action = msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'patted');
		}
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
