const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'dog',
			enabled: true,
			runIn: ['text'],
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
		const res = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
		return msg.channel.send('<:doggoblob:356254351615852544> I found this doggo image. Here you go!', { files: [{ attachment: res.body.data[0].url , name: `${res.body.data[0].id}.jpg` }] });
	}

};