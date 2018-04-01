const { Command } = require('klasa');
const snekfetch = require('snekfetch');
const { wordNik } = require('../../config.json');

module.exports = class DefineWord extends Command {

	constructor(...args) {
		super(...args, {
			botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			description: 'Defines a word.',
			usage: '<Word:string>'
		});
	}
	/* eslint-disable camelcase */
	async run(msg, [query]) {
		try {
			const { body } = await snekfetch
				.get(`http://api.wordnik.com:80/v4/word.json/${query.toLowerCase()}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					useCanonical: true,
					api_key: wordNik
				});
			if (!body.length) { return msg.send('Could not find any results.'); }
			const defineEmbed = new this.client.methods.Embed()
				.setColor('PURPLE')
				.setTitle(`"${body[0].word.toLowerCase()}"`)
				.setDescription(body[0].text)
				.addField('Type of Speech', body[0].partOfSpeech, true)
				.addField('Dictionary', body[0].sourceDictionary, true);
			return msg.sendEmbed(defineEmbed);
		} catch (err) {
			return msg.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};