const {
	Command
} = require('klasa');
const snekfetch = require('snekfetch');
const keys = require('../../keys.json');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'bot-info',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: [],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
			requiredSettings: [],
			description: 'Searches Discord Bots for information on a bot.',
			usage: '<Bot:user>',
			usageDelim: undefined,
			extendedHelp: ''
		});
	}

	async run(msg, args) {

		const bot = args[0];
		console.log(bot);
		try {
			const {
				body
			} = await snekfetch
					.get(`https://bots.discord.pw/api/bots/${bot.id}`)
					//.set({
					//	Authorization: keys.apiKey.dBotsORG
					//});
			const build = new this.client.methods.Embed()
				.setColor(0x9797FF)
				.setAuthor('Discord Bots', 'https://i.imgur.com/lrKYBQi.jpg')
				.setTitle(body.name)
				.setURL(`https://bots.discord.pw/bots/${bot.id}`)
				.setDescription(body.description)
				.addField('❯ Library',
					body.library, true)
				.addField('❯ Invite',
					`[Here](${body.invite_url})`, true)
				.addField('❯ Prefix',
					body.prefix, true);
			return msg.send('', {
				embed: build
			});
		} catch (err) {
			if (err.status === 404) return msg.say('Could not find any results.');
			return msg.send(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
		}
	}

};