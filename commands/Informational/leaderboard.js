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
		const leadboardPosition = await this.client.providers.get('collection').getAll('users').sort((a, b) => b.balance - a.balance);
		const leaderboard = [];
		let page = index ? index : 1;
		const totalPages = Math.round(leadboardPosition.size / 10);
		page -= 1;
		if (page > totalPages && !totalPages) return msg.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);
		if (totalPages && page + 1 > totalPages) return msg.channel.send(`There are only **${totalPages || 1}** pages in the leaderboard.`);

		leadboardPosition.map(p => ({ points: p.balance, user: p.id }))
			.slice(page * 10, (page + 1) * 10)
			.map((settingObject, i) => {
				leaderboard.push(`${(page * 10 + (i + 1)).toString().padStart(2, ' ')} ❯ ${this.client.users.get(settingObject.user).tag}${' '.repeat(30 - this.client.users.get(settingObject.user).tag.length)}::  ${settingObject.points.toLocaleString()}`);
			});
		leaderboard.push('');
		const pos = leadboardPosition.keyArray().indexOf(msg.author.id).toString().padStart(2, '0');

		leaderboard.push(`${pos !== -1 ? pos + 1 : '???'} ❯ ${msg.author.tag}${' '.repeat(30 - msg.author.tag.length)}::  ${this.client.settings.users.getEntry(msg.author.id).balance.toLocaleString()}`);
		leaderboard.push('--------------------------------------------------');
		return msg.channel.send(`= [ ${this.client.user.username}'s Global Balance Leaderboard ] =\n\n${leaderboard.join('\n')}\n Page ${page + 1} / ${totalPages || 1} | ${this.client.providers.get('collection').getAll('users').size} Total Users`, { code: 'asciidoc' });
	}

};
