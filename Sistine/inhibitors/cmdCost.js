const { Inhibitor } = require('klasa');

module.exports = class cmdCost extends Inhibitor {

	constructor(...args) {
		super(...args, {
			name: 'cmdCost',
			enabled: false,
			spamProtection: true
		});
	}

	async run(msg, cmd) {
		if (!cmd.cost) return;
		const newAmount = msg.author.conf.balance - cmd.cost;
		if (newAmount < 0) { throw `<:tickNo:373304949234204682> ${msg.author.tag}, you cannot afford to use **${cmd.name}** when you only have **${msg.author.conf.balance}** credits.`; }
		await msg.author.conf.update('balance', newAmount, msg.guild);
	}

};
