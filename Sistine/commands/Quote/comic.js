const { Command } = require('klasa');
const { get } = require('snekfetch');
const cheerio = require('cheerio');

module.exports = class Comic extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 12,
			description: 'Explosm Comics, why not have them?',
			botPerms: ['ATTACH_FILES']
		});
	}

	async run(msg) {
		const { body } = await get(`http://explosm.net/rcg/`);
		const cheerioResponse = cheerio.load(body);
		return msg.send('', { files: [`http:${cheerioResponse('#rcg-comic').first().find('img').first().attr('src').replace(/\\/g, '/')}`] });
	}

};
