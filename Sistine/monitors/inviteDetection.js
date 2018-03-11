const { Monitor } = require('klasa');

module.exports = class extends Monitor {

	constructor(...args) {
		super(...args, {
			name: 'invitedetection',
			enabled: true,
			ignoreSelf: true,
			ignoreBots: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		if (msg.channel.type !== 'text' || msg.guild.configs.antiinvite !== true) return null;
		if (await msg.hasAtLeastPermissionLevel(2)) return null;
		if (!/(https?:\/\/)?(www\.)?(discord\.(gg|li|me|io)|discordapp\.com\/invite)\/.+/.test(msg.content)) return null;
		return msg.delete()
			.catch(err => this.client.emit('log', err, 'error'));
	}

	async init() {
		if (!this.client.gateways.guilds.schema.has('antiinvite')) {
			await this.client.gateways.guilds.schema.add('antiinvite', { type: 'boolean', default: false });
		}
	}

};
