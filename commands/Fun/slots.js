const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'slots',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: '',
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...params]) {
        const slots = [':grapes:', ':tangerine:', ':pear:', ':cherries:', ':lemon:'];
    
        const slotOne = slots[Math.floor(Math.random() * slots.length)];
        const slotTwo = slots[Math.floor(Math.random() * slots.length)];
        const slotThree = slots[Math.floor(Math.random() * slots.length)];

        if (slotOne === slotTwo && slotOne === slotThree) {
            return msg.send(stripIndents`
                ${slotOne}|${slotTwo}|${slotThree}
                ${msg.language.get('SLOTS_WIN')}
            `);
        } else {
            return msg.send(stripIndents`
                ${slotOne}|${slotTwo}|${slotThree}
                ${msg.language.get('SLOTS_LOSE')}
            `);
        }
    }


};