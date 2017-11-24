const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Send feedback about Sistine to her developers.',
			usage: '<Message:string>',
			cooldown: 10
		});
	}

	async run(msg, [feedback]) {
		if (feedback.length < 3 || feedback.length > 700) {
			return msg.send(`<:tickNo:373304949234204682> Feedback must fit within Discord message regulations, so your message cannot ${feedback.length > 3 ? 'be less than 3 characters.' : 'be more than 700 characters.'}`);
		}
		const feedbackChannel = '383726730088808458';
		await msg.reply('your feedback has been sent! Based on your input, you may recieve a message.');
		return this.client.channels.get(feedbackChannel).send(`= [ Feedback Message ]=\n\n❯ User:: ${msg.author.tag}[${msg.author.id}]\n❯ Guild:: ${msg.guild.name}[${msg.guild.id}]\n\n❯ Message::\n${feedback}`, { code: 'asciidoc' });
	}

	async init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
