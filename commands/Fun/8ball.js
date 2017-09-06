const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: '8ball',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: ['decide'],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: '',
            usage: '<Question:str>',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...args]) {
        let answer;
        let params = encodeURIComponent('Is this the real life, or is this fantasy?')
        let uri = 'https://8ball.delegator.com/magic/JSON/' + params
        await snekfetch.get(uri)
            .then(r => {
                return msg.send(msg.language.get('EIGHTBALL_OUTLOOK', r.body.magic.answer))
            });
    }
};