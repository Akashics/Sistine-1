const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['connect'],

			description: 'Joins the message author\'s voice channel.'
		});
	}

	async run(msg) {
		const { voiceChannel } = msg.member;
		if (!voiceChannel) throw `<:eww:393547594690986018> **${msg.author.tag}**, You are not connected to a voice channel.`;
		this.resolvePermissions(msg, voiceChannel);

		const { music } = msg.guild;
		await music.join(voiceChannel);

		return msg.send(`:headphones: Successfully joined the voice channel **${voiceChannel}**.`);
	}

	resolvePermissions(msg, voiceChannel) {
		const permissions = voiceChannel.permissionsFor(msg.guild.me);

		if (permissions.has('CONNECT') === false) throw '<:eww:393547594690986018> I do not have enough permissions to connect to your voice channel.';
		if (permissions.has('SPEAK') === false) throw '<:eww:393547594690986018> I can connect... but not speak. Please turn on this permission so I can play music.';
		if (voiceChannel.full) throw '<:eww:393547594690986018> Your voice channel is full. Please make some room for me so I can play music.';
	}

};
