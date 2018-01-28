const { Command, Timestamp } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'creates a reminder',
			usage: '<when:time> <text:str> [...]',
			usageDelim: ' '
		});
	}

	async run(msg, [when, ...text]) {
		const reminderText = text.join(' ');
		const time = Timestamp.toNow(when);
		const reminder = await this.client.schedule.create('reminder', when, {
			data: {
				user: msg.author,
				text: reminderText,
				from: Date.now()
			}
		});
		return msg.send(`<:blobthumbsup:357267430105677844> I will remind you in ${time} to ${reminderText}. \`Code: ${reminder.id}\``);
	}

};
