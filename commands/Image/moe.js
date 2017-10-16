const { Command } = require('klasa');
const axios = require('axios');
const { weebKey } = require('../../keys.json');

const AuthStr = `Bearer ${weebKey}`;

module.exports = class extends Command {

	/* eslint-disable max-len */
	constructor(...args) {
		super(...args, {
			description: 'View random anime images.',
			usage: '[ImageType:string]'
		});
		this.types = ['awoo', 'bang', 'blush', 'clagwimoth', 'cry', 'dance', 'insult', 'jojo', 'lewd', 'lick', 'megumin', 'neko', 'nom', 'owo', 'pout', 'rem', 'shrug', 'sleepy', 'smile', 'teehee', 'smug', 'stare', 'thumbsup', 'triggered', 'wag', 'waifu_insult', 'wasted'];
	}

	async run(msg, [...args]) {
		const images = new this.client.methods.Embed();
		const image = args[0];
		if (!this.types.includes(image)) {
			images
				.setColor(msg.member.highestRole.color || 0)
				.setTitle(':book:  **Moe Command - Valid Image Types**')
				.setDescription('awoo, bang, blush, clagwimoth, cry, dance, insult, jojo, lewd, lick, megumin, neko, nom, owo, pout, rem, shrug, sleepy, smile, teehee, smug, stare, thumbsup, triggered, wag, waifu_insult, wasted')
				.setFooter(`Example CMD: ${msg.guild.settings.prefix}moe dance`);
			return msg.sendEmbed(images);
		}

		const imageRequest = await axios.get(`https://staging.weeb.sh/images/random?type=${image}`, { headers: { Authorization: AuthStr } });
		images
			.setColor(msg.member.highestRole.color || 0)
			.setImage(imageRequest.data.url)
			.setFooter(msg.language.get('WEEB_SERVICES'));
		return msg.sendEmbed(images);
	}

};
