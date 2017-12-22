const { Command } = require('klasa');
const { weebImage } = require('../../lib/Util');

module.exports = class KissImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to kiss another user.',
			usage: '[SomeoneToKiss:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_KISS_SOLO', msg.author) :
			msg.language.get('COMMAND_KISS', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};
