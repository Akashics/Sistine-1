const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { join } = require('path');
const imasnek = require('snekfetch');
const backgrounds = require('../../lib/profileBackgrounds.json');

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

		/* this.schema = {
			daily: {
				type: 'Integer',
				default: 1504120109,
				array: false,
				min: 1504120109
			},
			reputationTimer: {
				type: 'Integer',
				default: 1504120109,
				array: false,
				min: 1504120109
			},
			balance: {
				type: 'Integer',
				default: 0,
				array: false,
				min: 0
			},
			level: {
				type: 'Integer',
				default: 1,
				array: false,
				min: 1
			},
			reputation: {
				type: 'Integer',
				default: 0,
				array: false,
				min: 0
			}
		}; */
	}

	async run(msg, [user = msg.author]) {
		if (user.bot) return true;

		const { balance, level, reputation } = await user.conf;
		const guildCard = await fsn.readFile('./assets/images/profile-card.png');
		const userAvatar = await imasnek.get(user.displayAvatarURL({ format: 'png', size: 256 }));
		const profileCard = new Canvas(380, 450)
			.addImage(guildCard, 0, 0, 380, 450)
			.save()
			.addImage(userAvatar.body, 184, 355, 110, 110, { type: 'round', radius: 52.5 })
			.restore()
			.setTextFont('26px Discord')
			.setTextAlign('center')
			.addText(user.tag, 289, 550)
			.setColor('#000')
			.setTextFont('48px Corbert')
			.addText(level, 290, 634)
			.setTextFont('20px Corbert')
			.setTextAlign('left')
			.addText(`${reputation} points`, 497, 634)
			.addText(`${Number(balance).toLocaleString()}¥`, 89, 634);

		return msg.channel.send({ files: [{ attachment: profileCard.toBuffer(), name: `${user.tag}-profile.png` }] });
	}


	/* async validate(userResolvable) {
		const result = await this.resolver.user(userResolvable);
		if (result) return result;
		throw 'The parameter <User> expects either a User ID or a User Object.';
	}

	async init() {
		if (!this.client.gateways.users) { await this.client.gateways.add('users', this.validate, this.schema); }
	}*/

};
