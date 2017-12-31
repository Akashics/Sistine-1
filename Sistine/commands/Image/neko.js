const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class Neko extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 10,
			requiredSettings: [],
			description: 'This command will return a Neko, a lewd Neko if used in a NSFW channel.'
		});
	}

	async run(msg) {
		const { body } = await snek.get(`https://nekos.life/api${msg.channel.nsfw === true ? '/lewd' : ''}/neko`);
		return msg.channel.send({ embed: { image: { url: body.neko } } });
	}

};
