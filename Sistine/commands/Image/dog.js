const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Dog extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['randomdog', 'doggo'],
			description: 'Grabs a random dog image from random.dog.'
		});
	}

	async run(msg) {
		const { body: { message } } = await snek.get('https://dog.ceo/api/breeds/image/random');
		return msg.channel.sendFile(message);
	}

};
