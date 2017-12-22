const { Command } = require('klasa');
const ModLog = require('../../lib/modlog');

module.exports = class Unban extends Command {

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
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason';

		const bans = await msg.guild.fetchBans();

		if (bans.has(user.id) === false) {
			return msg.send(msg.language.get('UNBAN_FAIL'));
		}

		await msg.guild.unban(user, reasonFull);

		if (msg.guild.configs.logging.logChannel) {
			new ModLog(msg.guild)
				.setType('unban')
				.setModerator(msg.author)
				.setUser(user)
				.setReason(reasonFull)
				.send();
		}

		return msg.send(msg.language.get('UNBAN_SUCCESS', user.tag, reasonFull));
	}

};
