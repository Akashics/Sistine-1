const { Command } = require('klasa');

module.exports = class Remove extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			usage: '<number:integer>',
			description: 'Remove a song from the queue list.'
		});

		this.requireMusic = true;
	}

	async run(msg, [number]) {
		/* eslint-disable no-throw-literal */
		if (number <= 0) throw 'Invalid index.';
		number--;

		const { music } = msg.guild;
		if (music.queue.length < number) throw msg.language.get('MUSIC_OUTRANGE', music.queue.length);

		const song = music.queue[number];
		if (await !song.requester) throw 'There was an error fetching the requester.';
		if (await song.requester === 'Youtube Autoplay') {
			music.queue.splice(number, 1);
			return msg.send(msg.language.get('MUSIC_REMOVEDSONG', song));
		}
		if (song.requester.id !== msg.author.id) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(1);
			if (hasPermission === false) { throw 'You can\'t execute this command with the force flag. You must be at least a DJ Member.'; }
		}

		music.queue.splice(number, 1);
		return msg.send(msg.language.get('MUSIC_REMOVEDSONG', song));
	}

};
