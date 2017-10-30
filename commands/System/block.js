const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			aliases: ['unblock'],
			description: 'Blocks a user, prevents user interaction.',
			usage: '<User:user>'
		});
	}

	async run(msg, [user]) {
		const { blocklist } = this.client;
		if (blocklist.includes(user.id)) {
			return msg.send(`<:tickNo:373304949234204682> \`${user.tag}[${user.id}]\` is already blocklisted.`);
		}
		await this.client.blocklist.push(user.id);
		await writeJSONAtomic('./keys/blocklist.json', this.client.blocklist);
		return msg.send(`<:tickYes:373305832793833483> \`${user.tag}[${user.id}]\` was added to the blocklist.`);
	}

};
