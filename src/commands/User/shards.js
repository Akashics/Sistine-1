const { Command } = require('klasa');

module.exports = class Leaderboards extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lb'],
			description: 'Check the current credit leaderboard!',
			usage: '[index:integer]'
		});
	}
	/* eslint-disable max-len */
	async run(msg, [index]) {
		const leaderboard = [];

		var page = index ? index -= 1 : 0;
		leaderboard.push('=== Sistine Point Leaderboard ===\n');

		leadboardPosition.slice(page * 10, (page + 1) * 10)
			.map(user => ({ balance: user.balance, user: user.id }))
			.forEach((newMap, position) =>
				leaderboard.push(` • ${((page * 10) + (position + 1)).toString().padStart(2, ' ')} | ${this.client.users.get(newMap.user).tag.padEnd(30, ' ')}::  ${newMap.balance.toLocaleString()}`)
			);

		leaderboard.push(`\n •  ${pos !== -1 ? pos + 1 : '???'} | ${msg.author.tag.padEnd(30, ' ')}::  ${this.client.users.get(msg.author.id).configs.balance.toLocaleString()}`);
		leaderboard.push('--------------------------------------------------');
		return msg.send(`${leaderboard.join('\n')}\n Page ${page + 1} / ${totalPages || 1} - ${leadboardPosition.length} Total Users`, { code: 'asciidoc' });
	}

};
