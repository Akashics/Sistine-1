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
			return msg.send(msg.language.get('COMMAND_FEEDBACK', feedback));
		}
		const feedbackChannel = '383726730088808458';
		await msg.send(msg.language.get('COMMAND_FEEDBACK_SEND'));
		return this.client.channels.get(feedbackChannel).send(`= [ Feedback Message ]=\n\n❯ User:: ${msg.author.tag}[${msg.author.id}]\n❯ Guild:: ${msg.guild.name}[${msg.guild.id}]\n\n❯ Message::\n${feedback}`, { code: 'asciidoc' });
	}

};
