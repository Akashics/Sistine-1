const { Command } = require('klasa');

module.exports = class SubscriberSetting extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['SEND_MESSAGE'],
			guarded: true,
			nsfw: false,
			permLevel: 6,
			description: 'Set the current subscriber role!',
			usage: '[role:role]',
			usageDelim: ' '
		});
	}

	async run(msg, [role]) {
		if (role) {
			await msg.guild.configs.update('roles.subscriberRole', role, msg.guild);
			return msg.channel.send(`**${msg.guild.name}**'s subscriber role was set to \`${role.name}\` by **${msg.author.tag}.**`);
		}
		return msg.channel.send(`**${msg.guild.name}**'s subscriber role is currently set to \`${msg.guild.configs.roles.subscriberRole ? msg.guild.configs.roles.subscriberRole : 'nothing'}\`.`);
	}

};