const { Command } = require('klasa');
const { stripIndents } = require('common-tags');

module.exports = class Roast extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			description: 'Try your chances on the slots!'
		});
		this.cost = 10;
	}

	async run(msg) {
		const slots = [':grapes:', ':tangerine:', ':pear:', ':cherries:', ':lemon:'];

		const slotOne = slots[Math.floor(Math.random() * slots.length)];
		const slotTwo = slots[Math.floor(Math.random() * slots.length)];
		const slotThree = slots[Math.floor(Math.random() * slots.length)];

		if (slotOne === slotTwo && slotOne === slotThree) {
			return msg.send(stripIndents`
                ${slotOne}|${slotTwo}|${slotThree}
                ${msg.language.get('SLOTS_WIN')}
            `);
		}
		return msg.send(stripIndents`
                ${slotOne}|${slotTwo}|${slotThree}
                ${msg.language.get('SLOTS_LOSE')}
            `);
	}

};
