const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class WYR extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['wy-rather', 'wyr'],
			description: (msg) => msg.language.get('COMMAND_WYR_DESCRIPTION')
		});
		this.cost = 25;
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('http://www.rrrather.com/botapi');
			const embed = new this.client.methods.Embed()
				.setTitle(`${body.title}...`)
				.setURL(body.link)
				.setColor('PURPLE')
				.setDescription(`A: ${body.choicea} OR B: ${body.choiceb}?`);
			return msg.sendEmbed(embed);
		} catch (err) {
			return msg.send(msg.language.get('COMMAND_ERROR'));
		}
	}

};
