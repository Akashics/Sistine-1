const { Event } = require('klasa');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const { resolve, join } = require('path');

Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/Discord.ttf')), 'Discord');

module.exports = class guildMemberAdd extends Event {

	constructor(...args) {
		super(...args, { name: 'guildMemberRemove', enabled: true });
		this.makeLeaveImg = async (person, guildname) => {
			const png = person.displayAvatarURL.replace(/\.gif.+/g, '.png');
			const { body } = await snek.get(png);
			const pName = person.tag;
			const WelName = 'GOODBYE';
			const enjoyStay = `We hope you enjoyed here at ${guildname}.`;
			return new Canvas(1024, 450)
				.addImage(body, 384, 20, 256, 256, { type: 'round', radius: 128 })
				.restore()
				.setTextFont('80px Discord')
				.setColor('#FFFFFF')
				.setTextAlign('center')
				.addText(WelName, 512 - (WelName.length / 2), 350)
				.setTextFont('38px Discord')
				.addText(pName, 512 - (pName.length / 2), 388)
				.setTextFont('30px Discord')
				.addText(enjoyStay, 512 - (enjoyStay.length / 2), 440)
				.toBuffer();
		};
	}

	async run(member) {
		this.client.stats.increment('client.memberJoins');
		const { memberChannel, playerLogLevel, leaveMessages } = member.guild.settings.logging;
		if (!memberChannel || playerLogLevel <= 0 || !leaveMessages) { return; }

		this.client.stats.increment('client.memberLeaves');
		if (!member.guild.settings.logging.memberChannel || member.guild.settings.logging.playerLogLevel === 0) { return; }
		const byebyemsg = [
			`**${member.user.tag}** is gone, Cries !!!`,
			`**${member.user.tag}** ran away seeing a :snake: :stuck_out_tongue_winking_eye:`,
			`We have lost our player **${member.user.tag}**!`,
			`We need a substitute for **${member.user.tag}**.`,
			`Please say goodbye to **${member.user.tag}** we will miss you!`,
			`**${member.user.tag}** left without telling bye :neutral_face: .`,
			`I had sensed something wiered about **${member.user.tag}**`
		];

		switch (playerLogLevel) {
			case 1:
				member.guild.channels.get(memberChannel).send(byebyemsg[Math.floor(Math.random() * byebyemsg.length)]);
				break;
			case 2:
				member.guild.channels.get(memberChannel).send({
					embed: new this.client.methods.Embed()
						.setColor('PURPLE')
						.setDescription(byebyemsg[Math.floor(Math.random() * byebyemsg.length)])
						.setThumbnail(member.user.displayAvatarURL())
						.setTimestamp()
						.setFooter(this.client.user.username, this.client.user.avatarURL())
				});
				break;
			case 3:
				member.guild.channels.get(memberChannel).send({ files: [{ attachment: await this.makeLeaveImg(member.user, member.guild.name), name: `Welcome_${member.user.tag}.png` }] });
				break;
			default:
				break;
		}
	}

};
