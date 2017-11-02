const { Command } = require('klasa');
const { announcement } = require('../../util/Util');

module.exports = class Unsubscribe extends Command {

	constructor(...args) {
		super(...args, {
			name: 'unsubscribe',
			permLevel: 0,
			runIn: ['text'],

			description: 'Unsubscribe to this servers\' announcements.'
		});
	}

	async run(msg) {
		const role = await announcement(msg);
		if (!msg.member.roles.has(role)) { return msg.send(msg.language.get('ALREADY_SUBSCRIBE', false, msg.guild.name)); }
		await msg.member.removeRole(role);
		return msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
	}

};
