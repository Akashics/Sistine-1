const { Command } = require('klasa');

module.exports = class Engwish extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['hello'],
			description: 'English to Hewwo Translation',
			usage: '<Text:str>'
		});
		this.cost = 10;
	}

	translate(phrase) {
		const words = phrase.split(' ');
		const finalPhrase = [];
		words.forEach(word => {
			if (Math.random() > 0.7) {
				finalPhrase.push(`${word.charAt(0)}-${word}`);
			} else {
				finalPhrase.push(word);
			}
			if (Math.random() > 0.99) {
				finalPhrase.push("_OwO, what's this?_");
			}
		});
		const x3 = [' x3', ' :3', ' owo', ' OwO', ' OWO', ' X3'];
		return finalPhrase.join(' ').replaceAll('l', 'w').replaceAll('L', 'W').replaceAll('r', 'w').replaceAll('R', 'W') + x3.random();
	}

	async run(msg, [text]) {
		return msg.send(this.translate(text));
	}

};
