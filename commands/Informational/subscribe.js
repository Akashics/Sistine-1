const { Command } = require('klasa');
const { announcement } = require('../../util/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'subscribe',
			permLevel: 0,
			runIn: ['text'],

			description: 'Subscribe to this servers\' announcements.'
		});
	}

	async run(msg) {
		if (msg.guild.id !== '324051061033926666') return;
		const role = announcement(msg);
		await msg.member.addRole(role);
		msg.send(msg.language.get('COMMAND_SUBSCRIBE_SUCCESS', role.name));
	}

};
