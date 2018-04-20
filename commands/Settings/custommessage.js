const { Command } = require('klasa');

module.exports = class SubscriberSetting extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			enabled: false,
			botPerms: ['SEND_MESSAGE'],
			guarded: true,
			nsfw: false,
			permLevel: 6,
			description: 'Set the current Music DJ role!',
			usage: '[role:role]',
			usageDelim: ' '
		});
	}

	async run(msg, [role]) {
		if (role) {
			await msg.guild.configs.update('roles.musicdj', role, msg.guild);
			return msg.channel.send(`**${msg.guild.name}**'s music dj role was set to \`${role.name}\` by **${msg.author.tag}.**`);
		}
		return msg.channel.send(`**${msg.guild.name}**'s music dj role is currently set to \`${msg.guild.configs.roles.musicdj ? msg.guild.configs.roles.musicdj : 'nothing'}\`.`);
	}

};
