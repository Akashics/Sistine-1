const { Command } = require('klasa');

module.exports = class RestartMusic extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			runIn: ['text'],

			description: 'Restarts the music handler.'
		});
	}

	async run(msg) {
		await msg.guild.music.destroy();
		return msg.send('Successfully restarted the music module.');
	}

};
