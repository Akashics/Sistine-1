const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

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
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (!member);
		else if (!member.bannable) {
			return msg.send(msg.language.get('PUNISH_USER_ERROR', this.name));
		}

		await member.kick(reason);

		if (msg.guild.settings.modlog) {
			new ModLog(msg.guild)
				.setType('kick')
				.setModerator(msg.author)
				.setUser(member.user)
				.setReason(reason)
				.send();
		}

		return msg.send(msg.language.get('SUCCESSFUL_PUNISH', 'kicked', user.tag, reason));
	}

};