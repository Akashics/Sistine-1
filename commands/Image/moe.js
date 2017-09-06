const { Command } = require('klasa');
const axios = require('axios');
const keys = require('../../keys.json');
const AuthStr = 'Bearer ' + keys.weebAPIKey;
const types = ['awoo', 'bang', 'blush', 'clagwimoth', 'cry', 'dance', 'insult', 'jojo', 'lewd', 'lick', 'megumin', 'neko', 'nom', 'owo', 'pout', 'rem', 'shrug', 'sleepy', 'smile', 'teehee', 'smug', 'stare', 'thumbsup', 'triggered', 'wag', 'waifu_insult', 'wasted'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'moe',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Allows you to cuddle with another member.',
			usage: '<ImageType:string>',
			usageDelim: undefined,
			extendedHelp: 'No Extended Help.'
		});
	}

	async run(msg, [...args]) {
		const images = new this.client.methods.Embed();
		let image = args[0];
		if (image == 'types') {
			images
				.setColor(msg.guild.member(msg.author.id).highestRole.color || 0)
				.setTitle(':book:  **Moe Command - Valid Image Types**')
				.setDescription('awoo, bang, blush, clagwimoth, cry, dance, insult, jojo, lewd, lick, megumin, neko, nom, owo, pout, rem, shrug, sleepy, smile, teehee, smug, stare, thumbsup, triggered, wag, waifu_insult, wasted')
				.setFooter(`Example CMD: ${msg.guild.settings.prefix}moe dance`);
			return msg.send('', { embed: image });
		} else {
			if (!types.includes(image)) return msg.send('Use `' + msg.guild.settings.prefix + 'moe types` to see available image types.');
			var imageRequest = await axios.get(`https://staging.weeb.sh/images/random?type=${image}`, { headers: { Authorization: AuthStr } });
			images
				.setColor(msg.guild.member(msg.author.id).highestRole.color || 0)
				.setImage(imageRequest.data.url)
				.setFooter(msg.language.get('WEEB_SERVICES'));
			return msg.send('', { embed: image });
		}

	}

};