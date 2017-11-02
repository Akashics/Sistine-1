const { Command } = require('klasa');

module.exports = class Avatar extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['avtr'],
			description: 'Fetches a mentioned user\'s avatar.',
			usage: '[GuildMember:user]'
		});
	}

	async run(msg, [mentioned = msg.author]) {
		if (!mentioned.avatar) { return msg.send(msg.language.get('NO_AVATAR')); }
		const avatar = mentioned.displayAvatarURL({
			format: mentioned.avatar.startsWith('a_') ? 'gif' : 'png',
			size: 2048
		});
		return msg.send(avatar);
	}

};
