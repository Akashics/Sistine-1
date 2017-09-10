const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'avatar',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['avtr'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Fetches your or mentioned user\'s avatar',
			usage: '[GuildMember:member]',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg, [...args]) {
		const user = args[0].user || msg.author;
		if (!user.avatar) return msg.send(msg.language.get('NO_AVATAR'));
		const avatar = user.avatarURL({
			format: user.avatar.startsWith('a_') ? 'gif' : 'png',
			size: 2048
		});
		return msg.send(avatar);
	}

};