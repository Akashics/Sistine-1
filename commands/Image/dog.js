const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'dog',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 0,
			aliases: ['randomdog', 'doggo'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Posts a random dog image.',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'This command grabs a random dog from "The DogAPI".'
		});
	}

	async run(msg) {

		const {body} = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
		return msg.send({files: [{attachment: body.data[0].url, name: `${body.data[0].id}.jpg`}]});
	}

};