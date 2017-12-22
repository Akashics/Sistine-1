const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['vol'],
			description: 'Displays volume warning.'
		});

		this.requireMusic = true;
	}

	async run(msg) {
		return msg.send('In order to insure quality music, we are unable to control audio levels via a command.\nIt is recommended that you use Discord\'s User Volume to control the audio level.');
	}

};
