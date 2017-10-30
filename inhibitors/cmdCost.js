const { Inhibitor } = require('klasa');

module.exports = class extends Inhibitor {

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
		if (newAmount < 0) { throw `You do not have enough credits to use ${msg.cmd.name}`; }
		await this.client.settings.users.updateOne(msg.author.id, 'balance', newAmount, msg.guild);
		msg.channel.send(`You paid ${cmd.cost} for ${cmd.name}`);

		// This is where you place the code you want to run for your inhibitor
	}

};
