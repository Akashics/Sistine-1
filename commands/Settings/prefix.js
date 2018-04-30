const { Command } = require('klasa');

module.exports = class PrefixSetting extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['SEND_MESSAGE'],
			guarded: true,
			nsfw: false,
			permLevel: 6,
			description: 'Set the current prefix!',
			usage: '[prefix:string{1,16}]',
			usageDelim: ' '
		});
	}

	async run(msg, [prefix]) {
		if (prefix) {
			const current = await msg.guild.configs.prefix;
			if (current === prefix) return msg.channel.send('That is your current prefix already.');
			await msg.guild.configs.update('prefix', prefix, msg.guild);
			return msg.channel.send(`**${msg.guild.name}**'s prefix was set to \`${prefix}\` by **${msg.author.tag}.**`);
		}
		return msg.channel.send(`**${msg.guild.name}**'s prefix is currently set to \`${msg.guild.configs.prefix}\`.`);
	}

};
