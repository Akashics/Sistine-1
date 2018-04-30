const { Command } = require('klasa');
const ModLog = require('../../lib/structures/modlog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'kick',
			permLevel: 3,
			botPerms: ['KICK_MEMBERS'],
			runIn: ['text'],

			description: (msg) => msg.language.get('COMMAND_KICK_DESCRIPTION'),
			usage: '<user:member> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (member.highestRole.position >= msg.member.highestRole.position) {
			return msg.send(`${msg.author}, ${msg.language.get('POSITION')}`);
		} else if (member.kickable === false) {
			return msg.send(`${msg.author}, ${msg.language.get('COMMAND_KICK_FAIL_KICKABLE')}`);
		}

		await member.kick(reason);

		if (msg.guild.configs.modlog) {
			new ModLog(msg.guild)
				.setType('kick')
				.setModerator(msg.author)
				.setUser(member.user)
				.setReason(reason)
				.send();
		}

		return msg.send(`${msg.language.get('COMMAND_KICK_SUCCESS')} ${member.user.tag}${reason ? `\n${msg.language.get('REASON')}: ${reason}` : ''}`);
	}

};
