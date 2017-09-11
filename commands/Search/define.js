const { Command } = require('klasa');
const snekfetch = require('snekfetch');
const keys = require('../../keys.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'define',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			requiredSettings: [],
			description: 'Defines a word.',
			usage: '<Word:string>',
			usageDelim: undefined,
			extendedHelp: 'Use this command with the addition of an anime to give you information on it.'
		});
	}

	async run(msg, args) {

		const { query } = args[0];
		try {
			const { body } = await snekfetch
				.get(`http://api.wordnik.com:80/v4/word.json/${query}/definitions`)
				.query({
					limit: 1,
					includeRelated: false,
					useCanonical: false,
					api_key: keys.wordNik
				});
			if (!body.length) return msg.say('Could not find any results.');
			const tuna = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setTitle(body[0].word)
				.setDescription(body[0].text);
			return msg.send('', {embed: tuna});
		} catch (err) {
			return msg.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};