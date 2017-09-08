const { Client, PermissionLevels } = require('klasa');
const Music = require('./Music');
const keys = require('../../keys.json');

const permissionLevels = new PermissionLevels()
	.addLevel(0, false, () => true)
	.addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.dj && msg.member.roles.has(msg.guild.settings.dj))
	.addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.modRole && msg.member.roles.has(msg.guild.settings.modRole))
	.addLevel(3, false, (client, msg) => {
		if (!msg.guild) return false;
		if (msg.guild.settings.adminRole) return msg.member.roles.has(msg.guild.settings.adminRole);
		return msg.guild && msg.member.permissions.has('MANAGE_GUILD');
	})
	.addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
	.addLevel(9, true, (client, msg) => msg.author === client.owner)
	.addLevel(10, false, (client, msg) => msg.author === client.owner);

class Sistine extends Client {

	constructor(options) {
		super(Object.assign(options, { permissionLevels }));
		this.keys = Object.defineProperty(this, 'keys', { value: keys });
		this.queue = new Music();
	}

}

module.exports = Sistine;
