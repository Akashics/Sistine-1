const { Command } = require('klasa');
const { weebImage } = require('../../util/Util');

module.exports = class HugImage extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Want to hug another person?',
			usage: '[SomeoneToHug:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_HUG_SOLO', msg.author) :
			msg.language.get('COMMAND_HUG', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};
