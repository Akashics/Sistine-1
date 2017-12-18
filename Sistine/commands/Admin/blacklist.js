const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class Blacklist extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			permLevel: 10,
			description: 'Blacklist a guild, preventing guild creation.',
			usage: '<add|remove> <GuildIdentifier:guild|GuildID:str>',
			usageDelim: ' '
		});
	}

	async run(msg, [addremove, guild]) {
		const { blacklist } = this.client;
		switch (addremove) {
			case 'add':
				if (blacklist.includes(guild.id)) {
					return msg.send(msg.language.get('COMMAND_GUILDLIST_ALREADY', guild, 'blacklisted'));
				}
				await this.client.blacklist.push(guild.id);
				await writeJSONAtomic('./keys/blacklist.json', this.client.blacklist);
				return msg.send(msg.language.get('COMMAND_GUILDLIST_ADDED', guild, 'blacklist'));
			case 'remove':
				if (!blacklist.includes(guild.id)) {
					return msg.send(msg.language.get('COMMAND_GUILDLIST_NOT', guild, 'blacklisted'));
				}
				await blacklist.splice(blacklist.indexOf(guild.id));
				await writeJSONAtomic('./keys/blacklist.json', this.client.blacklist);
				return msg.send(msg.language.get('COMMAND_GUILDLIST_REMOVED', guild, 'blacklist'));
		}
		return msg.send('There were no valid options. Please try again.');
	}

};
