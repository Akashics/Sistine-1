const { Command } = require('klasa');
const { showSeconds } = require('../../util/Util');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],

			description: 'Check how much time is left for the song to end.'
		});
	}

	async run(msg) {
		/* eslint-disable no-throw-literal */
		const { status, dispatcher, queue } = msg.guild.music;

		if (status !== 'playing') { throw msg.language.get('MUSIC_NOTPLAYING', status); }
		return msg.send(`🕰 ${msg.language.get('TIME_REMAIN')}: ${showSeconds((queue[0].seconds * 1000) - dispatcher.time)}`);
	}

};
