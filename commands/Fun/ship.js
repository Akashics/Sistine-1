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
			usageDelim: ' ',
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, args) {
		list(arr) {
			const { length } = arr;
			return `${arr.slice(0, -1).join(', ')}${length > 1 ? `${length > 2 ? ',' : ''} ${conj} ` : ''}${arr.slice(-1)}`;
		}
		const { things } = args;
		return msg.say(`I'd give ${list(things)} a ${Math.floor(Math.random() * 100) + 1}%!`);
        
	}


};