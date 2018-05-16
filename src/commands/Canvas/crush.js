const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			requiredPermissions: ['ATTACH_FILES'],
			description: 'Display your affection for another user.',
			usage: '[Crush:username]'
		});
	}

	async run(msg, [crush = msg.author]) {
		const image = await this.client.idioticApi.crush(msg.author.displayAvatarURL({ format: 'png', size: 128 }), crush.displayAvatarURL({ format: 'png', size: 512 }));
		return msg.sendFile(image, 'I-Love-You-crush.png');
	}

};
