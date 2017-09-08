const { Command } = require('klasa');
const flip = require('flipacoin');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'coin',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['flip'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: '',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg) {
		let result = flip();
		return msg.send(msg.language.get('COINFLIP', result));

	}
};