const { Command } = require('klasa');
const { get, post } = require('snekfetch');
const inUse = new Map();

module.exports = class IsNowIllegal extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['sign'],
			description: 'US President Trump makes something illegal.',
			usage: '<Thing:string>',
			cooldown: 10
		});
		this.cost = 25;
	}

	async run(msg, [thing]) {
		if (inUse.get('true')) throw 'Trump is currently making something illegal, please wait.';
		inUse.set('true', { user: msg.author.id });
		const wordMatch = /^[a-zA-Z\s]{1,10}$/.exec(thing);
		if (thing.length < 1 || thing.length > 10) {
			inUse.delete('true');
			throw 'Cannot be longer than 10 characters or shorter than 1 character.';
		}
		if (!wordMatch) {
			inUse.delete('true');
			throw 'oops! Non-standard unicode characters are now illegal.';
		}
		try {
			const message = await msg.channel.send(`Convincing Trump that \`${thing.toProperCase}\` should be illegal...`);
			await post('https://is-now-illegal.firebaseio.com/queue/tasks.json').send({ task: 'gif', word: thing.toUpperCase() });
			await this.client.wait(5000);
			const result = await get(`https://is-now-illegal.firebaseio.com/gifs/${thing.toUpperCase()}.json`);
			await message.channel.send({ files: [result.body.url] });
			inUse.delete('true');
			return message.delete();
		} catch (error) {
			inUse.delete('true');
			throw error;
		}
	}

};
