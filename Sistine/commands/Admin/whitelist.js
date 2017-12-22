const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class Whitelist extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Whitelists a guild, preventing guild checks.',
			usage: '<add|remove> <GuildIdentifier:guild|GuildID:str>',
			usageDelim: ' '
		});
	}

	async run(msg, [addremove, guild]) {
		const { whitelist } = this.client;
		switch (addremove) {
			case 'add':
				if (whitelist.includes(guild.id)) {
					return msg.send(msg.language.get('COMMAND_GUILDLIST_ALREADY', guild, 'whitelisted'));
				}
				await this.client.whitelist.push(guild.id);
				await writeJSONAtomic('./lists/whitelist.json', this.client.whitelist);
				return msg.send(msg.language.get('COMMAND_GUILDLIST_ADDED', guild, 'whitelist'));
			case 'remove':
				if (!whitelist.includes(guild.id)) {
					return msg.send(msg.language.get('COMMAND_GUILDLIST_NOT', guild, 'whitelisted'));
				}
				await whitelist.splice(whitelist.indexOf(guild.id));
				await writeJSONAtomic('./lists/whitelist.json', this.client.whitelist);
				return msg.send(msg.language.get('COMMAND_GUILDLIST_REMOVED', guild, 'whitelist'));
		}
		return msg.send('There were no valid options. Please try again.');
	}

};
