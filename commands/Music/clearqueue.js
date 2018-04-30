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

		if (music.voiceChannel.members.size > 4) {
			if (!await msg.hasAtLeastPermissionLevel(2)) throw "You can't execute this command when there are over 4 members. You must be at least a Dj Member.";
		}
		const size = music.queue.length;
		music.prune();
		return msg.send(`Successfully removed ${size} songs from the queue.`);
	}

};
