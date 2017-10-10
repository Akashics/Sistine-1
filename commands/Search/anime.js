const { Command } = require('klasa');
const anilist = require('../../util/anilist');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'anime',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Get information on your an anime.',
			usage: '<Anime:string>',
			usageDelim: undefined,
			extendedHelp: 'Use this command with the addition of an anime to give you information on it.'
		});
	}

	async run(msg, [...args]) {
		const animeRequest = await anilist.search(args, 'anime');
		if (animeRequest.data.error) {
			if (animeRequest.data.error.messages[0] === 'No Results.') {
				return msg.send(msg.language.get('ANILIST_NO_RESULT', args[0]));
			}
		}
		if (animeRequest.data.length >= 1) {
			const characters = await anilist.loadCharacters(animeRequest.data[0].id, 'anime');
			const final = await anilist.buildResponse(msg, animeRequest.data[0], characters, 'Anime');
			return msg.send('', { embed: final });
		}
		return msg.send(msg.language.get('ANILIST_NO_RESULT', args[0]));
	}

};
