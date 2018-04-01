const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Prune the queue list.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;

		if (music.voiceChannel.members.size > 5) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(1);
			if (hasPermission === false) throw '<:eww:393547594690986018> Forcing a song skip requires a DJ permissions. Make sure you have that role or there are less than 5 people total in the channel.';
		}

		music.prune();
		return msg.send(`🗑️ Pruned **${music.queue.length}** songs from the queue.`);
	}

};
