const { Command } = require('klasa');

module.exports = class Skip extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			usage: '[-force]',
			description: 'Skip the current song.'
		});

		this.requireMusic = true;
	}

	async run(msg, [force]) {
		/* eslint-disable no-throw-literal */
		const { music } = msg.guild;

		if (music.voiceChannel.members.size > 4) {
			if (force) {
				const hasPermission = await msg.hasAtleastPermissionLevel(1);
				if (hasPermission === false) { throw 'You can\'t execute this command with the force flag. You must be at least a Moderator Member.'; }
			} else {
				const response = this.handleSkips(music, msg.author.id, msg);
				if (response) { return msg.send(response); }
			}
		}
		if (music.queue.length <= 0) return msg.send('You cannot skip songs that are not in the queue.');
		await msg.send(`⏭ Skipped ${music.queue[0].title || 'Title Error'}`);
		music.skip(true);
		return null;
	}

	handleSkips(musicInterface, user, msg) {
		if (!musicInterface.queue) return 'There is nothing in the queue, try adding something and then playing it.';
		if (!musicInterface.queue[0].skips) {
			musicInterface.queue[0].skips = new Set();
		}
		if (musicInterface.queue[0].skips.has(user)) { return msg.language.get('MUSIC_ALREADYVOTED'); }
		musicInterface.queue[0].skips.add(user);
		const members = musicInterface.voiceChannel.members.size - 1;
		return this.shouldInhibit(members, musicInterface.queue[0].skips.size);
	}

	shouldInhibit(total, size) {
		if (total <= 3) { return true; }
		return size >= total * 0.4 ? false : `🔸 | Votes: ${size} of ${Math.ceil(total * 0.4)}`;
	}

};
