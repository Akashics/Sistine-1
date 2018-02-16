const { Event } = require('klasa');

module.exports = class guildMemberRemove extends Event {

	constructor(...args) {
		super(...args, { name: 'guildMemberRemove', enabled: true });
	}

	async run(member) {
		this.client.stats.increment('client.memberLeaves');
		const { memberChannel, leaveMessages } = member.guild.configs.logging;
		if (!memberChannel || !leaveMessages) return;

		const user = member.user.tag;

		const leaveStrings = [
			`Finally, I thought _${user}_ would never leave!`,
			`_${user}_ figured out what the leave button did.`,
			`It seems like _${user}_ left, its not like we needed them or anything...`,
			`Awh, I-I have no words for t-this, b-but, I-I'll miss you _${user}_-san!`,
			`Awh, _${user}_ has left... n-not that I care!`,
			`_${user}_-san... N-no...`,
			`_${user}_, why would you leave me here alone with these guys?`,
			`Eep! _${user}_ left?! H-hes always leaving me, that baka...`,
			`${user} has left a note: "Out on Vacation. Be back: ???"`,
			`${user} left us just like my father.`,
			`No one ever listens to ${user} until they made the mistake of leaving us.`,
			`Seems ${user} wanted to remain single.`,
			`Go after ${user}! They just robbed everyone of all their credits!`,
			`I didn't know that ${user} could fit in my trunk.`,
			`Sorry for the awful, mean, and semi-accurate things ${user}-san said.`
		];

		member.guild.channels.get(memberChannel).send(`<:leave:397102213807210517> ${leaveStrings[Math.floor(Math.random() * leaveStrings.length)]}`);
	}

};
