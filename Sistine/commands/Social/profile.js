const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { join } = require('path');
const imasnek = require('snekfetch');

Canvas.registerFont(join(__dirname, '../../assets/fonts/Corbert-Condensed.otf'), 'Corbert');
Canvas.registerFont(join(__dirname, '../../assets/fonts/Discord.ttf'), 'Discord');

module.exports = class Profile extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['balance', 'bal', 'credits'],
			cooldown: 10,
			description: 'Check yours or another\'s profile.',
			usage: '[User:user]'
		});
	}

	async run(msg, [user = msg.author]) {
		if (user.bot) return true;
		const messg = await msg.send(`<a:loading:402288838187417601> _Looking up ${user.username}'s information..._`);

		const { balance, level, reputation } = await user.configs;
		const guildCard = await fsn.readFile('./assets/images/profile-card.png');
		const userAvatar = await imasnek.get(user.displayAvatarURL({ format: 'png', size: 256 }));
		const profileCard = new Canvas(600, 750)
			.addImage(guildCard, 0, 0, 600, 750)
			.save()
			.addImage(userAvatar.body, 65, 235, 240, 240, { type: 'round', radius: 120 })
			.restore()
			.setTextFont('36px Discord')
			.setColor('#551A8B')
			.setTextAlign('center')
			.addText(user.tag, 300, 570)
			.setColor('#000')
			.setTextFont('42px Corbert')
			.addText(level, 290, 634)
			.setTextFont('36px Corbert')
			.setTextAlign('center')
			.addText(`${reputation}`, 497, 634)
			.addText(`${Number(balance).toLocaleString()}¥`, 89, 634);
		await messg.delete().catch(error => this.client.emit('warn', error));
		return msg.channel.send({ files: [{ attachment: profileCard.toBuffer(), name: `${user.tag}-profile.png` }] });
	}

};
