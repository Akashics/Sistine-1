const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class Softban extends Command {

	constructor(...args) {
		super(...args, {
			name: 'softban',
			permLevel: 2,
			botPerms: ['BAN_MEMBERS'],
			runIn: ['text'],

			description: 'Softbans the mentioned member.',
			usage: '<user:user> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason.';

		const member = await msg.guild.members.fetch(user).catch(() => null);

		if (!member || !member.bannable) {
			return msg.send(msg.language.get('SBAN_FAIL'));
		}

		await msg.guild.ban(user, { reason, days: 1 });
		await msg.guild.unban(user, msg.language.get('SOFTBAN_PROCESS'));

		if (msg.guild.configs.logging.logChannel) {
			new ModLog(msg.guild)
				.setType('softban')
				.setModerator(msg.author)
				.setUser(user)
				.setReason(reasonFull)
				.send();
		}

		return msg.send(msg.language.get('SBAN_SUCCESS', user.tag, reasonFull));
	}

};
