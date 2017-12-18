const { Command } = require('klasa');

module.exports = class Join extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['connect'],

			description: 'Joins the message author\'s voice channel.'
		});
	}

	async run(msg) {
		/* eslint-disable no-throw-literal */

		const { voiceChannel } = msg.member;
		if (!voiceChannel) { throw msg.language.get('MUSIC_USER_NOVOICE'); }
		this.resolvePermissions(msg, voiceChannel);

		const { music } = msg.guild;
		return music.join(voiceChannel);
	}

	resolvePermissions(msg, voiceChannel) {
		const permissions = voiceChannel.permissionsFor(msg.guild.me);

		if (permissions.has('CONNECT') === false) { throw msg.language.get('MUSIC_NOCONNECT'); }
		if (permissions.has('SPEAK') === false) { throw msg.language.get('MUSIC_NOSPEAK'); }
	}

};