const { Command } = require('klasa');
const compliments = require('../../util/compliment');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'compliment',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: 'Compliments a user.',
            usage: '[User:member]',
            usageDelim: undefined,
            extendedHelp: 'No Extended Help.'
        });
    }

    async run(msg, [...args]) {
		const user = args[0].user || msg.author;
		return msg.send(`${user.username}, ${compliments[Math.floor(Math.random() * compliments.length)]}`);
    }

};