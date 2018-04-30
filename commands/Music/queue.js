const { Command } = require('klasa');
const { showSeconds } = require('../../lib/util/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['EMBED_LINKS'],
			description: 'Check the queue list.',
			usage: '[page:integer]'
		});
	}

	async run(msg, [page = 1]) {
		const { music } = msg.guild;
		if (!music.queue.length) throw 'There are no songs in the queue.';
		const paginated = this.paginate(music.queue, page);
		const currentSong = music.queue[0];
		const timeLeft = currentSong.duration - (music.player.state.time - music.player.timestamp);
		const totalQueueLength = music.queue.reduce((prev, song) => prev + song.duration, 0);
		msg.sendEmbed(new this.client.methods.Embed()
			.setColor('#ff8142')
			.setAuthor(`Page ${paginated.page} / ${paginated.maxPage} | Music Queue`)
			.setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
			.setTimestamp()
			.setDescription(`
${paginated.items.map((item, index) => `${index + 1}. [${item.title.replace(/\[|\]/g, '\\$&')}](${item.url}) (${item.friendlyDuration})`).join('\n')}

**Now playing:** ${`[${currentSong.title.replace(/\[|\]/g, '\\$&')}](${currentSong.url})`}
**Progress:** ${music.paused ? 'Paused: ' : ''}${showSeconds(currentSong.duration - timeLeft)} / ${currentSong.friendlyDuration} (${showSeconds(timeLeft)} left)
**Total queue length:** ${showSeconds(totalQueueLength)}
`));
	}

	paginate(queue, page = 1) {
		const maxPage = Math.ceil(queue.length / 5);
		if (page < 1) page = 1;
		if (page > maxPage) page = maxPage;
		const startIndex = (page - 1) * 5;
		return {
			page,
			maxPage,
			items: queue.length > 5 ? queue.slice(startIndex, startIndex + 5) : queue
		};
	}

};
