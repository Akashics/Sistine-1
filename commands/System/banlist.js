const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'banlist',
			enabled: true,
			runIn: ['text', 'dm'],
			cooldown: 2,
			aliases: [],
			permLevel: 10,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Ban a Guild from Bot Usage.',
			usage: '<someGuild:guild|someID:str> <banreason:string> [...]',
			usageDelim: ' ',
			extendedHelp: 'No extended help available.'
		});
	}
  
	async run(msg, [guild, ...reason]) {
		if (guild === '324051061033926666') {
			return msg.send('You cannot ban the support guild.');
		}

		reason = reason.join(this.usageDelim);
		
		this.client.banlist[guild] = reason;

		await writeJSONAtomic('../../banlist.json', this.client.banlist);
	}
};