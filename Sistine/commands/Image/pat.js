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
		const action = mentioned === msg.author ?
			msg.language.get('COMMAND_PAT_SOLO', msg.author) :
			msg.language.get('COMMAND_PAT', mentioned, msg.author);
		const embed = await weebImage(msg, this.client, action);
		return msg.sendEmbed(embed);
	}

};
