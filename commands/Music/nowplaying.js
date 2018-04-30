const { Command } = require('klasa');
const { showSeconds } = require('./../../lib/util/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			botPerms: ['EMBED_LINKS'],
			description: 'Get information from the current song.'
		});
	}

	async run(msg) {
		const { queue, playing, player } = msg.guild.music;
		if (!playing) throw "I'm currently not playing anything.";

		const song = queue[0];
		const timeLeft = song.duration - (player.state.time - player.timestamp);

		const embed = new this.client.methods.Embed()
			.setColor('#ff8142')
			.setAuthor(`${song.title} - ${song.author}`)
			.setURL(song.url)
			.setDescription(`
**Duration:** ${song.friendlyDuration}
**Current time:** ${showSeconds(song.duration - timeLeft)}
**Time remaining:** ${showSeconds(timeLeft)}
**Requested by:** ${song.requester.user.tag} (${song.requester.id})`)
			.setFooter(`Requested by ${msg.author.tag}`)
			.setTimestamp();
		return msg.sendEmbed(embed);
	}

};
