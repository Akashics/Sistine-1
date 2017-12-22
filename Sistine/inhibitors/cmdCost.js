const { Inhibitor } = require('klasa');

module.exports = class cmdCost extends Inhibitor {

	constructor(...args) {
		super(...args, {
			name: 'cmdCost',
			enabled: true,
			spamProtection: true
		});
	}

	async run(msg, cmd) {
		if (!cmd.cost) { return; }
		const newAmount = msg.author.conf.balance - cmd.cost;
		if (newAmount < 0) { throw `<:tickNo:373304949234204682> Using \`${cmd.name}\` would cost you \`${cmd.cost}\` when you only have \`${msg.author.conf.balance}\` credits.`; }
		await msg.author.conf.update(msg.author.id, 'balance', newAmount, msg.guild);
	}

};
