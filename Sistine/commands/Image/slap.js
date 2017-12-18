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
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_SLAP_SOLO', msg.author) :
			msg.language.get('COMMAND_SLAP', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};