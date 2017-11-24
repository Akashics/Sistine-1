const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class Warn extends Command {

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
		const reasonFull = reason.length > 0 ? reason.join(' ') : 'No Reason Specified.';

		if (member.highestRole.position >= msg.member.highestRole.position) {
			return msg.send(msg.language.get('WARN_FAIL'));
		}

		if (msg.guild.settings.logging.logChannel) {
			new ModLog(msg.guild)
				.setType('warn')
				.setModerator(msg.author)
				.setUser(member.user)
				.setReason(reasonFull)
				.send();
		}
		member.send(`**You have been warned by ${msg.author.tag}**\n\n__Reason:__ ${reasonFull}\nFriendly Tip: __Being polite while in a group with others will get you invited back!__`)
			.catch(() => msg.send('User did not recieve the warning, they may have DMs disabled.'));
		return msg.send(msg.language.get('WARN_SUCCESS', member.tag, reasonFull));
	}

};
