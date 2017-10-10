const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			aliases: ['conch'],
			description: 'Asks your question to the Magic Conch.',
			usage: '<Question:String>'
		});
		this.answers = ['Maybe someday', 'Nothing', 'Neither', 'I don\'t think so', 'Yes', 'Try asking again later'];
	}

	async run(msg) {
		return msg.send(stripIndents`:shell: ${this.answers[Math.floor(Math.random() * this.answers.length)]}`);
	}

};
