const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['bal'],
			description: 'Check your credit balance.',
			usage: '[GuildMember:member]'
		});
		/* eslint-disable quotes */
		this.schema = {
			blocked: {
				type: "Boolean",
				default: false,
				array: false
			},
			balance: {
				type: "Integer",
				default: 0,
				array: false,
				min: 0
			}
		};
	}

	async validate(resolver, user) {
		const result = await resolver.user(user);
		if (!result) throw 'The parameter <User> expects either a User ID or a User Object.';
		return result;
	}

	async init() {
		if (!this.client.settings.users) await this.client.settings.add('users', this.validate, this.schema);
	}

	async run(msg, [mentioned]) {
		if (mentioned && msg.author.hasAtleastPermissionLevel(7)) {
			const { balance } = mentioned.user.conf;
			return msg.send(`${mentioned.user.tag} currently has ${balance || 0} credits.`);
		}
		const { balance } = msg.author.conf;
		return msg.send(`${msg.author.tag}, you currently have ${balance || 0} credits.`);
	}

};
