const { Command } = require('klasa');
const moment = require('moment');

module.exports = class UserInfo extends Command {

	constructor(...args) {
		super(...args, {
			description: 'Get information on a mentioned user.',
			usage: '[Member:member]'
		});

		this.statuses = {
			online: '<:online:313956277808005120> Online',
			idle: '<:away:313956277220802560> Idle',
			dnd: '<:dnd:313956276893646850> Do Not Disturb',
			offline: '<:offline:313956277237710868> Offline'
		};
	}

	async run(msg, [member = msg.member]) {
		const leadboardPosition = this.client.providers.get('collection').getAll('users').sort((a, b) => b.balance - a.balance).keyArray().indexOf(member.user.id);

		const userInfo = new this.client.methods.Embed()
			.setColor('PURPLE')
			.setThumbnail(member.user.displayAvatarURL())
			.addField('🢒 Name', member.user.tag, true)
			.addField('🢒 ID', member.id, true)
			.addField('🢒 Discord Join Date', moment(member.user.createdAt).format('MMMM Do YYYY'), true)
			.addField('🢒 Server Join Date', moment(member.joinedTimestamp).format('MMMM Do YYYY'), true)
			.addField('🢒 Status', this.statuses[member.user.presence.status], true)
			.addField('🢒 Playing', member.user.presence.activity ? member.user.presence.activity.name : 'N/A', true)
			.addField('🢒 Highest Role', member.highestRole.name !== '@everyone' ? member.highestRole.name : 'None', true)
			.addField('🢒 Hoist Role', member.hoistRole ? member.hoistRole.name : 'None', true)
			.addField('🢒 Credits', member.user.conf.balance || 0, true)
			.addField('🢒 Leaderboard Ranking', leadboardPosition + 1, true);
		return msg.sendEmbed(userInfo);
	}

};
