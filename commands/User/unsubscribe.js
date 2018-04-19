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
<<<<<<< HEAD:commands/User/unsubscribe.js
		await msg.member.roles.remove(role, 'Unsubscribed from Announcements');
=======
		await msg.member.roles.remove(role);
>>>>>>> 2b5bc69953e79c717480108c75780c1be7a6920d:commands/Informational/unsubscribe.js
		return msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
	}

};
