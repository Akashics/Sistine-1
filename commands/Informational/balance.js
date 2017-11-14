const { Command } = require('klasa');

module.exports = class Balance extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bal', 'credits'],
			description: 'Check your credit balance.',
			usage: '[GuildMember:member]'
		});
		/* eslint-disable quotes */
		this.schema = {
			balance: {
				type: "Integer",
				default: 0,
				array: false,
				min: 0
			},
			daily: {
				type: "Integer",
				default: 1504120109,
				array: false,
				min: 1504120109
			},
			level: {
				type: "Integer",
				default: 1,
				array: false,
				min: 1
			},
			reputation: {
				type: "Integer",
				default: 0,
				array: false,
				min: 0
			}
		};
	}

	async validate(resolver, user) {
		const result = await resolver.user(user);
		if (!result) { throw 'The parameter <User> expects either a User ID or a User Object.'; }
		return result;
	}

	async init() {
		if (!this.client.settings.users) { await this.client.settings.add('users', this.validate, this.schema); }
	}

	async run(msg, [mentioned]) {
		if (mentioned && msg.hasAtLeastPermissionLevel(9)) {
			const { balance } = mentioned.user.conf;
			return msg.send(`${mentioned.user.tag} currently has ${balance || 0} credits.`);
		}
		const { balance } = msg.author.conf;
		return msg.send(`${msg.author.tag}, you currently have ${balance || 0} credits.`);
	}

};
