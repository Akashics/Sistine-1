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
		const { body } = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
		return msg.channel.send({ files: [{ attachment: body.data[0].url, name: `${body.data[0].id}.${body.data[0].format}` }] });
	}

};
