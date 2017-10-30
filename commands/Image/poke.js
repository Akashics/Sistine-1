const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to poke another member.',
			usage: '[SomeoneToPoke:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		let self = false;
		if (mentioned === msg.author) self = true;
		const action = self ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'be poked') : msg.language.get('USER_REACTION', msg.author.toString(), mentioned.user.toString(), 'poked');
		const embed = await weebImage(msg, this.client, mentioned, self, action);
		return msg.sendEmbed(embed);
	}

};
