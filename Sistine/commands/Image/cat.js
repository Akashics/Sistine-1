const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Cat extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['randomcat', 'catto'],
			description: (msg) => msg.language.get('COMMAND_CAT_DESCRIPTION')
		});
	}

	async run(msg) {
		const { body: { file } } = await snek.get('http://random.cat/meow');
		return msg.channel.sendFile(file, `cat.${file.split('.')[2]}`);
	}

};
