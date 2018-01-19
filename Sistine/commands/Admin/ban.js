const { Command } = require('klasa');
const ModLog = require('../../lib/modlog');

module.exports = class Ban extends Command {

	constructor(...args) {
		super(...args, {
			name: 'ban',
			permLevel: 2,
			botPerms: ['BAN_MEMBERS'],
			runIn: ['text'],
			description: 'Bans the mentioned member.',
			usage: '<Member:member> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason.';

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member || !member.bannable) { return msg.send(msg.language.get('BAN_FAIL')); }

		await member.ban({ reason });

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
