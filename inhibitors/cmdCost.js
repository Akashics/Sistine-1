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
		if (msg.author.bot || this.client.blocklist.includes(msg.author.id)) throw undefined;
		if (!cmd.cost) { return; }
		const newAmount = msg.author.conf.balance - cmd.cost;
		if (newAmount < 0) { throw `<:tickNo:373304949234204682> Using \`${cmd.name}\` would cost you \`${cmd.cost}\` when you only have \`${msg.author.conf.balance}\` credits.`; }
		await this.client.settings.users.updateOne(msg.author.id, 'balance', newAmount, msg.guild);
	}

};
