const { Command } = require('klasa');
const { list } = require('../../util/Util');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ship',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: 'Ships two people together.',
            usage: '<PersonOne:member> <PersonTwo:member>',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...params]) {

        const { things } = args;
        return msg.say(`I'd give ${list(things)} a ${Math.floor(Math.random() * 100) + 1}%!`);
        
    }


};