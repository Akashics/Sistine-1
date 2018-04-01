const { Command } = require('klasa');
const { showSeconds } = require('../../lib/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Check how much time is left for the song to end.'
		});
	}

	async run(msg) {
		const { status, dispatcher, queue } = msg.guild.music;

		if (status !== 'playing') throw `There is no song playing right now. :thinking:\n**Current status:** \`${status}\``;
		return msg.send(`🕰 **Time remaining:** ${showSeconds((queue[0].seconds * 1000) - dispatcher.streamTime)}`);
	}

};
