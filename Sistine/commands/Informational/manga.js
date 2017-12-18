const { Command } = require('klasa');
const anilist = require('../../util/anilist');

module.exports = class Manga extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get information on a provided manga.',
			usage: '<Manga:string>',
			enabled: false
		});
	}

	async run(msg, [title]) {
		const queryRequest = await anilist.search(msg, title, 'MANGA');
		const entries = queryRequest.data.Page.media;
		if (!entries.length > 0) return msg.send(msg.language.get('COMMAND_ANILIST_NORESULTS', title));
		return msg.sendEmbed(await anilist.buildResponse(msg, entries, 'MANGA'));
	}

};
