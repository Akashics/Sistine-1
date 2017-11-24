const { Command } = require('klasa');

module.exports = class Lockdown extends Command {

	constructor(...args) {
		super(...args, {
			name: 'lockdown',
			permLevel: 2,
			botPerms: ['MANAGE_CHANNELS', 'MANAGE_ROLES'],
			runIn: ['text'],
			description: 'Lock/unlock the selected channel.',
			usage: '<channel:channel>'
		});
	}

	async run(msg, [channel]) {
		const locked = await this.handleLockdown(msg, channel, channel.type === 'text' ? 'SEND_MESSAGES' : 'CONNECT');

		if (msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES') === false) {
			return true;
		}
		return msg.send(msg.language.get('LOCKDOWN', locked, channel));
	}

	handleLockdown(msg, channel, permission) {
		const permOverwrite = channel.permissionOverwrites.get(channel.guild.defaultRole.id);
		const locked = permOverwrite ? permOverwrite.denied.has(permission) : false;
		return channel.overwritePermissions(channel.guild.defaultRole, { [permission]: locked }, locked ? msg.language.get('RELEASELOCK') : msg.language.get('UNRELEASELOCK'))
			.then(() => !locked);
	}

};
