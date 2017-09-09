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
			description: ''
		});
	}

	async run(msg) {
		let result = flip();
		return msg.send(msg.language.get('COINFLIP', result));

	}
};