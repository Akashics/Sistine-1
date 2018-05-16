const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['ATTACH_FILES'],
			description: 'Admire the beauty of a user thru the power of images',
			usage: '[User:username]',
			extendedHelp: 'Mention another user to admire a painting of them.'
		});
	}

	async run(msg, [user = msg.author]) {
		const image = await this.client.idioticApi.beautiful(user.displayAvatarURL({ format: 'png', size: 256 }));
		return msg.sendFile(image, 'beautiful.png');
	}

};
