const { Command } = require('klasa');
const { stripIndents } = require('common-tags');
const answers = ['Maybe someday', 'Nothing', 'Neither', 'I don\'t think so', 'Yes', 'Try asking again'];

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'magic-conch',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['conch'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Asks your question to the Magic Conch.',
			usage: '<Question:String>',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, args) {

		const { question } = args[0];
		return msg.send(stripIndents`
			:shell: ${answers[Math.floor(Math.random() * answers.length)]}
		`);

	}
};