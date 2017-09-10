const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'cat',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['randomcat'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Posts a random cat image.',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'This command grabs a random cat from "http://random.cat/meow".'
		});
	}

	async run(msg) {
		const { body } = await snek.get('http://random.cat/meow');
		return msg.send('<:plusheenblob:356253615448391680> I found this cat image. Here you go!', {files: [{attachment: body.file, name: `cat.${body.file.split('.')[2]}`}]});
	}

};