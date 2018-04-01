const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Allows you to clean the queue, otherwise removes everthing from queue.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		const { music } = msg.guild;
		if (music.voiceChannel.members.size > 3) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(1);
			if (!hasPermission) throw 'Forcing a song skip requires a DJ permissions. Make sure you have that role or there are less than 5 people total in the channel.';
		}
		await music.prune();
		return msg.send(`🗑️ Pruned **${music.queue.length}** songs from the queue.`);
	}

};
