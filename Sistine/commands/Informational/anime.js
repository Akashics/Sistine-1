const { Command } = require('klasa');
const anilist = require('../../lib/anilist');

module.exports = class Anime extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get information on a provided anime name.',
			usage: '<Anime:string>'
		});
	}

	async run(msg, [title]) {
		// search for anime, if ava -> load characters and build response. TODO: Merge Loading and Building.
		const queryRequest = await anilist.search(msg, title, 'ANIME');
		const entries = queryRequest.data.Page.media;
		if (!entries.length > 0) return msg.send(msg.language.get('COMMAND_ANILIST_NORESULTS', title));
		return msg.sendEmbed(await anilist.buildResponse(msg, entries, 'Anime'));
	}

};
