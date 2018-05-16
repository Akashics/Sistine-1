const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['ATTACH_FILES'],
			aliases: ['painting'],
			description: 'Fear nothing... but that thing.',
			usage: '[User:username]'
		});
	}

	async run(msg, [user = msg.author]) {
		const image = await this.client.idioticApi.heavyFear(user.displayAvatarURL({ format: 'png', size: 256 }));
		return msg.sendFile(image, 'heavy-fear.png');
	}

};
