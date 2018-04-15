const { Command } = require('klasa');
const announcement = require('../../lib/announcement');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'unsubscribe',
			permLevel: 0,
			runIn: ['text'],

			description: (msg) => msg.language.get('COMMAND_UNSUBSCRIBE_DESCRIPTION')
		});
	}

	async run(msg) {
		const role = announcement(msg);
		await msg.member.roles.remove(role);
		return msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
	}

};
