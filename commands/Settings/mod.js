const { Command } = require('klasa');

module.exports = class ModSetting extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['SEND_MESSAGE'],
			guarded: true,
			nsfw: false,
			permLevel: 6,
			description: 'Set the current mod role!',
			usage: '[role:role]',
			usageDelim: ' '
		});
	}

	async run(msg, [role]) {
		if (role) {
			await msg.guild.configs.update('roles.moderator', role, msg.guild);
			return msg.channel.send(`**${msg.guild.name}**'s moderator role was set to \`${role.name}\` by **${msg.author.tag}.**`);
		}
		return msg.channel.send(`**${msg.guild.name}**'s moderator role is currently set to \`${msg.guild.configs.roles.moderator ? msg.guild.configs.roles.moderator : 'nothing'}\`.`);
	}

};
