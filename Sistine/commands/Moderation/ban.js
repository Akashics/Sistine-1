const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class Ban extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ban',
			permLevel: 2,
			botPerms: ['BAN_MEMBERS'],
			runIn: ['text'],
			description: 'Bans the mentioned member.',
			usage: '<user:user> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason.';

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member || !member.bannable) { return msg.send(msg.language.get('BAN_FAIL')); }

		await msg.guild.ban(user, { reason });

		if (msg.guild.configs.logging.logChannel) {
			new ModLog(msg.guild)
				.setType('ban')
				.setModerator(msg.author)
				.setUser(user)
				.setReason(reasonFull)
				.send();
		}
		return msg.send(msg.language.get('BAN_SUCCESS', user.tag, reasonFull));
	}

};
