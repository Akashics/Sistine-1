const { Argument, util: { regExpEsc } } = require('klasa');
const { Role } = require('discord.js');

const ROLE_REGEXP = new RegExp('^(?:<@&)?(\\d{17,21})>?$');

module.exports = class extends Argument {

	run(arg, possible, msg) {
		if (!msg.guild) return this.client.arguments.get('role').run(arg, possible, msg);
		const resRole = this.resolveRole(arg, msg.guild);
		if (resRole) return resRole;

		const results = [];
		const reg = new RegExp(regExpEsc(arg), 'i');
		for (const role of msg.guild.roles.values()) {
			if (reg.test(role.name)) results.push(role);
		}

		let querySearch;
		if (results.length > 0) {
			const regWord = new RegExp(`\\b${regExpEsc(arg)}\\b`, 'i');
			const filtered = results.filter(role => regWord.test(role.name));
			querySearch = filtered.length > 0 ? filtered : results;
		} else {
			querySearch = results;
		}

		switch (querySearch.length) {
			case 0: throw `${possible.name} Must be a valid name, id or role mention`;
			case 1: return querySearch[0];
			default: throw `Found multiple matches: \`${querySearch.map(role => role.name).join('`, `')}\``;
		}
	}

	resolveRole(query, guild) {
		if (query instanceof Role) return guild.roles.has(query.id) ? query : null;
		if (typeof query === 'string' && ROLE_REGEXP.test(query)) return guild.roles.get(ROLE_REGEXP.exec(query)[1]);
		return null;
	}

};
