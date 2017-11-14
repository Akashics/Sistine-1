const { Command } = require('klasa');
const axios = require('axios');

module.exports = class MoeImage extends Command {

	/* eslint-disable max-len */
	constructor(...args) {
		super(...args, {
			description: 'View random anime images.',
			usage: '[ImageType:string]'
		});
		this.types = ['awoo', 'bang', 'blush', 'clagwimoth', 'cry', 'dance', 'insult', 'jojo', 'lewd', 'lick', 'megumin', 'neko', 'nom', 'owo', 'pout', 'rem', 'shrug', 'sleepy', 'smile', 'teehee', 'smug', 'stare', 'thumbsup', 'triggered', 'wag', 'waifu_insult', 'wasted', 'greet'];
	}

	async run(msg, [type]) {
		const images = new this.client.methods.Embed();
		if (!this.types.includes(type)) {
			images
				.setColor('PURPLE')
				.setTitle(':book:  **Moe Command - Valid Image Types**')
				.setDescription('awoo, bang, blush, clagwimoth, cry, dance, insult, jojo, lewd, lick, megumin, neko, nom, owo, pout, rem, shrug, sleepy, smile, teehee, smug, stare, thumbsup, triggered, wag, waifu_insult, wasted, greet')
				.setFooter(`Example CMD: ${msg.guild.settings.prefix}moe dance`);
			return msg.sendEmbed(images);
		}
		const AuthStr = `Bearer ${this.client.keys.weebKey}`;
		const imageRequest = await axios.get(`https://api.weeb.sh/images/random?type=${type}`, { headers: { Authorization: AuthStr } });
		images
			.setColor('PURPLE')
			.setImage(imageRequest.data.url)
			.setFooter(msg.language.get('WEEB_SERVICES'));
		return msg.sendEmbed(images);
	}

};
