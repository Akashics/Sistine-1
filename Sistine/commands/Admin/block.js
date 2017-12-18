const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class Block extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Blocks a user, prevents user interaction.',
			usage: '<User:user>'
		});
	}

	async run(msg, [user]) {
		const { blocklist } = this.client;
		if (blocklist.includes(user.id)) {
			return msg.send(msg.language.get('COMMAND_GUILDLIST_ALREADY', user, 'blocked'));
		}
		await this.client.blocklist.push(user.id);
		await writeJSONAtomic('./keys/blocklist.json', this.client.blocklist);
		return msg.send(msg.language.get('COMMAND_GUILDLIST_ADDED', user, 'blocklist'));
	}

};
