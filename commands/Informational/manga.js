const { Command } = require('klasa');
const anilist = require('../../util/anilist');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get information on a provided manga.',
			usage: '<Manga:string>'
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
			const embedFinal = await anilist.buildResponse(msg, animeRequest.data[0], characters, 'Manga');
			return msg.sendEmbed(embedFinal);
		}
		return msg.send(msg.language.get('ANILIST_NO_RESULT', args[0]));
	}

};
