const { Command } = require('klasa');
const announcement = require('../../lib/announcement');

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
		const role = announcement(msg);
<<<<<<< HEAD
		await msg.member.roles.add(role, 'Subscribed to Announcements');
=======
		await msg.member.roles.add(role);
>>>>>>> 2b5bc69953e79c717480108c75780c1be7a6920d
		return msg.send(msg.language.get('COMMAND_SUBSCRIBE_SUCCESS', role.name));
	}

};
