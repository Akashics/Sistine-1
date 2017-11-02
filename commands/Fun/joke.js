const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class Joke extends Command {

	constructor(...args) {
		super(...args, { description: 'Responds with a random dad joke.' });
		this.cost = 1;
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://icanhazdadjoke.com/')
				.set({ Accept: 'application/json' });
			return msg.send(`≧◡≦ ${body.joke}`);
		} catch (err) {
			return msg.send(msg.language.get('ERROR_OCCURED', err.message));
		}
	}

};
