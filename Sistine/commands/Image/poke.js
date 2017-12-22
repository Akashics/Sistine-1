const { Command } = require('klasa');
const { weebImage } = require('../../lib/Util');

module.exports = class PokeImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to poke another member.',
			usage: '[SomeoneToPoke:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_POKE_SOLO', msg.author) :
			msg.language.get('COMMAND_POKE', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};
