const { Command } = require('klasa');
const { get } = require('snekfetch');
const cheerio = require('cheerio');

module.exports = class Comic extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 12,
			botPerms: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		const { body } = await get(`http://explosm.net/rcg/`);
		const cheerioResponse = cheerio.load(body);
		return msg.send(msg.language.get('COMMAND_FUN_COMIC'), { files: [`http:${cheerioResponse('#rcg-comic').first().find('img').first().attr('src').replace(/\\/g, '/')}`] });
	}

};
