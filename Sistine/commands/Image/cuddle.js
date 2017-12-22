const { Command } = require('klasa');
const { weebImage } = require('../../lib/Util');

module.exports = class Cuddle extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Allows you to cuddle with another user.',
			usage: '[SomeoneToCuddle:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_CUDDLE_SOLO', msg.author) :
			msg.language.get('COMMAND_CUDDLE', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};
