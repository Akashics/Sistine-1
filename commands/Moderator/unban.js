const { Command } = require('klasa');
const ModLog = require('../../lib/modlog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'unban',
			permLevel: 4,
			botPerms: ['BAN_MEMBERS'],
			runIn: ['text'],

			description: (msg) => msg.language.get('COMMAND_UNBAN_DESCRIPTION'),
			usage: '<user:user> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await msg.guild.fetchBans();

		if (bans.has(user.id) === false) {
			return msg.send(`${msg.author}, ${msg.language.get('COMMAND_UNBAN_FAIL')}`);
		}

		await msg.guild.unban(user, reason);

		if (msg.guild.configs.modlog) {
			new ModLog(msg.guild)
				.setType('unban')
				.setModerator(msg.author)
				.setUser(user)
				.setReason(reason)
				.send();
		}

		return msg.send(`${msg.language.get('COMMAND_UNBAN_SUCCESS')} ${user.tag}${reason ? `\n${msg.language.get('REASON')}: ${reason}` : ''}`);
	}

};
