const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['vol'],

			usage: '[-force|-f]',
			description: 'Skip the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg, [force]) {
		const { music } = msg.guild;
		if (music.status === 'idle') throw 'You can\'t skip anything if nothing is being played';
		if (music.queue.length === 0 && !music.autoplay) throw 'There are no songs in the queue to skip.';

		if (music.voiceChannel.members.size > 5) {
			if (force) {
				const hasPermission = await msg.hasAtLeastPermissionLevel(1);
				if (!hasPermission) throw ':headphones: Forcing a song skip requires a DJ permissions. Make sure you have that role or there are less than 5 people total in the channel.';
			} else {
				const response = this.handleSkips(music, msg.author.id);
				if (response) return msg.send(response);
			}
		}

		await msg.send(`⏭ **${music.queue[0].title ? music.queue[0].title : 'Error Loading Song...'}** was skipped by **${msg.author.tag}**.`);
		music.skip(true);
		return null;
	}

	handleSkips(musicInterface, user) {
		if (!musicInterface.queue[0].skips) musicInterface.queue[0].skips = new Set();
		if (musicInterface.queue[0].skips.has(user)) return 'You have already voted to skip this song.';
		musicInterface.queue[0].skips.add(user);
		const members = musicInterface.voiceChannel.members.size - 1;
		return this.shouldInhibit(members, musicInterface.queue[0].skips.size);
	}

	shouldInhibit(total, size) {
		if (total <= 3) return true;
		return size >= total * 0.4 ? false : `🔸 | Votes: ${size} of ${Math.ceil(total * 0.4)}`;
	}

};
