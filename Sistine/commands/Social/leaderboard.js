const { Command } = require('klasa');

module.exports = class Leaderboards extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['lb'],
			description: 'Check the current credit leaderboard!',
			usage: '[index:integer]'
		});
	}

	async run(msg, [index]) {
		if (this.client.uptime < 300000) return msg.send('I just restarted, so I need some time to calculate the leaderboard.');
		const data = await this.client.providers.get('rethinkdb').getAll('users').then(res => res.sort((a, b) => b.balance - a.balance));
		const leadboardPosition = data.filter(account => this.client.users.get(account.id));

		const leaderboard = [];
		const totalPages = Math.round(leadboardPosition.length / 10);

		var page = index ? index -= 1 : 0;

		if (page > totalPages && !totalPages) return msg.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
		if (totalPages && page + 1 > totalPages) return msg.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);

		leaderboard.push('= = = Global Leaderboard = = =\n\n');

		const pos = leadboardPosition.indexOf(msg.author.id).toString().padStart(2, '0');

		leadboardPosition.slice(page * 10, (page + 1) * 10)
			.map(user => ({ balance: user.balance, user: user.id }))
			.forEach((newMap, position) =>
				leaderboard.push(` • ${((page * 10) + (position + 1)).toString().padStart(2, ' ')} | ${this.client.users.get(newMap.user).tag.padEnd(30, ' ')}::  ${this.client.users.get(newMap.user).configs.balance.toLocaleString()}`)
			);

		leaderboard.push(` • ${pos !== -1 ? pos + 1 : '???'} | ${msg.author.tag.padEnd(30, ' ')}::  ${this.client.users.get(msg.author.id).configs.balance.toLocaleString()}`);
		leaderboard.push('--------------------------------------------------');
		return msg.channel.send(`${leaderboard.join('\n')}\n Page ${page + 1} / ${totalPages || 1} - ${leadboardPosition.length} Total Users`, { code: 'asciidoc' });
	}

};
