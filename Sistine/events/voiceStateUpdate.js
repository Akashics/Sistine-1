const { Event } = require('klasa');

module.exports = class voiceStateUpdate extends Event {

	constructor(...args) {
		super(...args, { name: 'voiceStateUpdate', enabled: true });
	}

	run(oldMem, newMem) {
		const { queue, dispatcher } = newMem.guild.music;
		if (!queue) return;
		if (!oldMem.guild.me.voiceChannel) return;
		if (oldMem.voiceChannel === oldMem.guild.me.voiceChannel && newMem.voiceChannel !== newMem.guild.me.voiceChannel && newMem.guild.me.voiceChannel.members.size === 1) {
            const voiceChannel = newMem.guild.me.voiceChannel; // eslint-disable-line
			dispatcher.end('endAll');
			newMem.guild.music.channel.send(':musical_note: All members have left the channel, so I stopped playing music.');
			newMem.guild.music.leave();
		}
	}

};
