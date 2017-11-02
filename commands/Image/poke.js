const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class PokeImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to poke another member.',
			usage: '[SomeoneToPoke:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'be poked') : msg.language.get('USER_REACTION', msg.author.toString(), mentioned.toString(), 'poked');
		const embed = await weebImage(msg, this.client, mentioned, action);
		return msg.sendEmbed(embed);
	}

};
