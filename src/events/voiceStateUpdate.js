const { Event } = require('klasa');

module.exports = class extends Event {

	async run(oldMem, newMem) {
		const { queue, dispatcher, status } = newMem.guild.music;
		setTimeout(async () => {
			if (!oldMem.guild.me.voiceChannel || !status === 'playing' || !queue) return;
			if (this.client.settings.patreon === true) return;
			setTimeout(async () => {
				if (oldMem.voiceChannel === oldMem.guild.me.voiceChannel && newMem.voiceChannel !== newMem.guild.me.voiceChannel && newMem.guild.me.voiceChannel.members.size === 1) {
					if (dispatcher) {
						try {
							await dispatcher.end();
							queue.textChannel.send('***No one left in Voice Channel, leaving...***');
							return newMem.guild.music.leave();
						} catch (error) {
							console.log(`| VoiceStateUpdate |\n${error}`);
						}
					}
				}
			}, 3600000);
		}, 10000);
	}

};
