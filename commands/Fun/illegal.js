const { Command } = require('klasa');
const { get, post } = require('snekfetch');
const inUse = new Map();

module.exports = class IsNowIllegal extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sign'],
			description: 'US President Trump makes something illegal.',
			usage: '<Thing:string>',
			cooldown: 15
		});
		this.cost = 15;
	}

	async run(msg, [thing]) {
		if (inUse.get('true')) throw msg.language.get('trumpInUse');
		inUse.set('true', { user: msg.author.id });
		const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(thing);
		if (thing.length < 1 || thing.length > 10) {
			inUse.delete('true');
			throw msg.language.get('trumpSyntax');
		}
		if (!wordMatch) {
			inUse.delete('true');
			throw msg.language.get('trumpIllegalCharacter', msg.author.username);
		}
		try {
			const message = await msg.channel.send(msg.language.get('trumpConvincing', thing.toProperCase()));
			await post('https://is-now-illegal.firebaseio.com/queue/tasks.json').send({ task: 'gif', word: thing.toUpperCase() });
			await this.client.wait(6000);
			const result = await get(`https://is-now-illegal.firebaseio.com/gifs/${thing.toUpperCase()}.json`);
			await msg.channel.send({ files: [result.body.url] });
			inUse.delete('true');
			return message.delete();
		} catch (error) {
			inUse.delete('true');
			throw error;
		}
	}

};
