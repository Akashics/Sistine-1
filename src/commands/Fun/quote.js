const { Command } = require('klasa');
const Discord = require('discord.js');
const snek = require('snekfetch');

module.exports = class Quote extends Command {

	constructor(...args) {
		super(...args, {
			requiredPermissions: ['SEND_MESSAGE', 'MANAGE_WEBHOOKS'],
			description: 'Quote Somebody.',
			usage: '<User:user|Mention:mention> <Quote:string> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [mention, text]) {
		const avatar = await snek.get(mention.displayAvatarURL());
		const webhook = await msg.channel.createWebhook(mention.username, { avatar, reason: 'Needed a cool new Webhook' });
		console.log(webhook);
		const hooker = new Discord.WebhookClient(webhook.id, webhook.token);
		console.log(hooker);
		await hooker.send(text)
			.then(() => webhook.delete())
			.catch((error) => {
				console.log(error);
				return webhook.delete();
			});
	}

};
