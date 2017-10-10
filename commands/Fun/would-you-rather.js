const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['wy-rather', 'wyr'],
			description: 'Responds with a random would you rather question.'
		});
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('http://www.rrrather.com/botapi');
			const embedDone = new this.client.methods.Embed()
				.setTitle(`${body.title}...`)
				.setURL(body.link)
				.setColor(0x9797FF)
				.setDescription(`${body.choicea} OR ${body.choiceb}?`);
			return msg.send('', { embed: embedDone });
		} catch (err) {
			return msg.send(msg.language.get('ERROR_OCCURED', err.message));
		}
	}

};
