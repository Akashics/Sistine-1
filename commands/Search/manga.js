const { Command } = require('klasa');
const anilist = require('../../util/anilist');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'manga',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Get information on a manga.',
			usage: '<Manga:string>',
			usageDelim: undefined,
			extendedHelp: 'Use this command with the addition of an manga to give you information on it.'
		});
	}

	async run(msg, [...args]) {
		const animeRequest = await anilist.search(args, 'manga');
		if (animeRequest.data.error) {
			if (animeRequest.data.error.messages[0] === 'No Results.') {
				return msg.send(msg.language.get('ANILIST_NO_RESULT', args[0]));
			}
		}
		if (animeRequest.data.length >= 1) {
			const characters = await anilist.loadCharacters(animeRequest.data[0].id, 'manga');
			const final = await anilist.buildResponse(msg, animeRequest.data[0], characters, 'Manga');
			return msg.send('', { embed: final });
		}
		return msg.send(msg.language.get('ANILIST_NO_RESULT', args[0]));
	}

};
