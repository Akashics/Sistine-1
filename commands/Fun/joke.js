const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class Joke extends Command {

	constructor(...args) {
		super(...args, { aliases: ['dad'], description: 'Responds with a random dad joke.' });
		this.cost = 10;
		this.emoji = [
			'( ಠ ʖ̯ ಠ)',
			'( ఠ ͟ʖ ఠ)',
			'(っ˘ڡ˘ς)',
			'(∩｀-´)⊃━☆ﾟ.*･｡ﾟ',
			'(⊃｡•́‿•̀｡)⊃',
			'(._.)',
			'♨_♨',
			'[¬º-°]¬',
			'(Ծ‸ Ծ)',
			'ヾ(-_- )ゞ',
			'(づ￣ ³￣)づ',
			'ﾟДﾟ',
			'（ ^_^）',
			'ฅ^•ﻌ•^ฅ',
			'ಠ_ಠ'
		];
	}

	async run(msg) {
		try {
			const { body } = await snekfetch
				.get('https://icanhazdadjoke.com/')
				.set({ Accept: 'application/json' });
			return msg.send(`${this.emoji[Math.floor(Math.random() * this.emoji.length)]} \`${body.joke}\``);
		} catch (err) {
			return msg.send(msg.language.get('ERROR_OCCURED', err.message));
		}
	}

};
