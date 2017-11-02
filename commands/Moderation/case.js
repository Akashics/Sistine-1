const { Command } = require('klasa');

module.exports = class CaseInfo extends Command {

	constructor(...args) {
		super(...args, {
			name: 'case',
			permLevel: 2,
			runIn: ['text'],

			description: 'Check a case.',
			usage: '<case:integer>'
		});

		this.provider = null;
	}

	async run(msg, [selected]) {
		const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
		const log = modlogs[selected];
		if (!log) { return msg.send(msg.language.get('MODLOG_CASE_ERROR')); }
		return msg.send([
			`${msg.language.get('USER')}      : ${log.user.tag} (${log.user.id})`,
			`${msg.language.get('MODERATOR')}  : ${log.moderator.tag} (${log.moderator.id})`,
			`${msg.language.get('REASON')}     : ${log.reason || msg.language.get('MODLOG_REASON_UNKOWN', msg.guild.settings.prefix, selected)}`
		], { code: 'http' });
	}

	init() {
		this.provider = this.client.providers.get('json');
	}

};
