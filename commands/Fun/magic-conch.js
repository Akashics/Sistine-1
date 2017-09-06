const { Command } = require('klasa');
const { stripIndents } = require('common-tags');
const answers = ['Maybe someday', 'Nothing', 'Neither', 'I don\'t think so', 'Yes', 'Try asking again'];

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'joke',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: 'Asks your question to the Magic Conch.',
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...args]) {

		const { question } = args;
		return msg.send(stripIndents`
			:shell: ${answers[Math.floor(Math.random() * answers.length)]}
		`);

    }
};