const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class Unblock extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Unblocks a user, allowing user interaction.',
			usage: '<User:user>'
		});
	}

	async run(msg, [user]) {
		const { blocklist } = this.client;
		if (!blocklist.includes(user.id)) {
			return msg.send(msg.language.get('COMMAND_GUILDLIST_NOT', user, 'blocked'));
		}
		await blocklist.splice(blocklist.indexOf(user.id));
		await writeJSONAtomic('./keys/blocklist.json', this.client.blocklist);
		return msg.send(msg.language.get('COMMAND_GUILDLIST_REMOVED', user, 'blocklist'));
	}

};
