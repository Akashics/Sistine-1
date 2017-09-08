const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'unban',
			permLevel: 2,
			botPerms: ['BAN_MEMBERS'],
			runIn: ['text'],

			description: 'Unbans the mentioned user.',
			usage: '<user:user> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [user, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		const bans = await msg.guild.fetchBans();

		if (bans.has(user.id) === false) {
			return msg.send(msg.language.get('PUNISH_UNBAN_ERROR'));
		}

		await msg.guild.unban(user, reason);

		if (msg.guild.settings.modlog) {
			new ModLog(msg.guild)
				.setType('unban')
				.setModerator(msg.author)
				.setUser(user)
				.setReason(reason)
				.send();
		}

		return msg.send(msg.language.get('SUCCESSFUL_PUNISH', 'unbanned', user.tag, reason));
	}

};