const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class Kick extends Command {

	constructor(...args) {
		super(...args, {
			name: 'kick',
			permLevel: 2,
			botPerms: ['KICK_MEMBERS'],
			runIn: ['text'],
			description: 'Kicks the mentioned member.',
			usage: '<user:member> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason';

		if (!member || !member.kickable) {
			return msg.send(msg.language.get('KICK_FAIL'));
		}

		await member.kick(reason);

		if (msg.guild.configs.logging.logChannel) {
			new ModLog(msg.guild)
				.setType('kick')
				.setModerator(msg.author)
				.setUser(member.user)
				.setReason(reasonFull)
				.send();
		}

		return msg.send(msg.language.get('KICK_SUCCESS', member.user.tag, reasonFull));
	}

};
