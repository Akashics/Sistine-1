const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			usage: '<number:integer>',
			description: 'Remove a song from the queue list.'
		});

		this.requireMusic = true;
	}

	async run(msg, [number]) {
		if (number <= 0) throw ':thinking: I don\'t think you know how numbers work.';
		number--;

		const { music } = msg.guild;
		if (music.queue.length < number) throw `:headphones: The queue only has **${music.queue.length}** songs.`;

		const song = music.queue[number];
		if (song.requester.id !== msg.author.id) {
			const hasPermission = await msg.hasAtLeastPermissionLevel(1);
			if (hasPermission === false) throw '<:eww:393547594690986018> Removing a song skip requires a DJ permissions. Make sure you have that role.';
		}

		music.queue.splice(number, 1);
		return msg.send(`:wastebasket: Removed the song **${song.title}** requested by **${song.requester}**.`);
	}

};
