const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'warn',
			permLevel: 2,
			runIn: ['text'],

			description: 'Warns the mentioned member.',
			usage: '<user:member> [reason:string] [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [member, ...reason]) {
		reason = reason.length > 0 ? reason.join(' ') : null;

		if (member.highestRole.position >= msg.member.highestRole.position) {
			return msg.send(msg.language.get('PUNISH_USER_ERROR'));
		}

		if (msg.guild.settings.modlog) {
			new ModLog(msg.guild)
				.setType('warn')
				.setModerator(msg.author)
				.setUser(member.user)
				.setReason(reason)
				.send();
		}

		return msg.send(msg.language.get('SUCCESSFUL_PUNISH', 'warned', user.tag, reason));
	}

};