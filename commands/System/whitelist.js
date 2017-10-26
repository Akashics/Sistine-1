const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class extends Command {

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
					return msg.send(`<:tickNo:315009174163685377> \`${guild}[${guild.id}\` is already whitelisted.`);
				}
				await this.client.whitelist.push(guild.id);
				await writeJSONAtomic('./keys/whitelist.json', this.client.whitelist);
				return msg.send(`<:tickYes:315009125694177281> \`${guild}[${guild.id}]\` was added to the whitelist.`);
			case 'remove':
				if (!whitelist.includes(guild.id)) {
					return msg.send(`<:tickNo:315009174163685377> \`${guild}[${guild.id}]\` is not whitelisted.`);
				}
				await whitelist.splice(whitelist.indexOf(guild.id));
				await writeJSONAtomic('./keys/whitelist.json', this.client.whitelist);
				return msg.send(`<:tickYes:315009125694177281> \`${guild}[${guild.id}]\` was removed from the whitelist.`);
		}
		return msg.send('There were no valid options. Please try again.');
	}

};
