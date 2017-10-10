const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['randomcat'],
			description: 'Grabs a random cat image from random.cat.'
		});
	}

	async run(msg) {
		const { body } = await snek.get('http://random.cat/meow');
		return msg.send('<:plusheenblob:356253615448391680> I found this cat image. Here you go!', { files: [{ attachment: body.file, name: `cat.${body.file.split('.')[2]}` }] });
	}

};
