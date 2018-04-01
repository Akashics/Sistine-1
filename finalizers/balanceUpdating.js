const { Finalizer } = require('klasa');

module.exports = class balanceUpdater extends Finalizer {

	constructor(...args) {
		super(...args, { enabled: true });
	}

	run(msg) {
		if (!msg.command.cost) return;
		msg.author.configs.update('balance', msg.author.configs.balance - msg.command.cost, msg.guild);
	}

};
