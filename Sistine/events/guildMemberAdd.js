const { Event } = require('klasa');

module.exports = class guildMemberRemove extends Event {

	constructor(...args) {
		super(...args, { name: 'guildMemberAdd', enabled: true });
	}

	async run(member) {
		this.client.stats.increment('client.memberLeaves');
		const { memberChannel, joinMessages } = member.guild.configs.logging;
		if (!memberChannel || !joinMessages) return;

		const user = member.user.tag;

		const joinStrings = [
			`Y-yay! More people to deal with. Welcome ${user}!`,
			`Ergh, why did ${user} show up? I already have to deal with ${member.guild.memberCount - 1} other users.`,
			`OwO Who's this? ${user} has joined ${member.guild.name}.`,
			`O-ohayou ${member.user.username}-san.`,
			`Looks like ${user} landed on the wrong side of Discord.`,
			`O-oh, welcome ${member.user.username}-san. I hope I haven't embarrased you...`,
			`Roses are red, violets are blue, ${user} joined this server to be with you.`,
			`${user} just happened to show up.`,
			`Look out for ${user}. They just set off the alarm.`,
			`Have you ever tried to s>poke ${user}?`,
			`${user} has joined the server, however it didn't seem very effective.`,
			`Ha! ${user} activivated my trap card!`,
			`Ohmaiglob, ${user} is here!`,
			`${user} has joined the guild. Lets file that under "Never Again".`,
			`${user}'s Pizza. How may I help you?`,
			`Shhh! ${user} is sleeping...`
		];

		member.guild.channels.get(memberChannel).send(`<:join:397077767797211157> ${joinStrings[Math.floor(Math.random() * joinStrings.length)]}`);
	}

};
