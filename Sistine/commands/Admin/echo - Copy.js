const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['talk'],
			permLevel: 6,
			usage: '[channel:channel] [message:string] [...]',
			usageDelim: ' ',
			description: (msg) => msg.language.get('COMMAND_ECHO_DESCRIPTION')
		});
	}

	async run(msg, [channel = msg.channel, ...content]) {
		if (msg.deletable) msg.delete().catch(() => null);

		const attachment = msg.attachments.size > 0 ? msg.attachments.first().url : null;
		content = content.length ? content.join(' ') : '';

		if (content.length === 0 && !attachment) throw 'I have no content nor attachment to send, please write something.';

		const options = {};
		if (attachment) options.files = [{ attachment }];

		return channel.send(content, options);
	}

};