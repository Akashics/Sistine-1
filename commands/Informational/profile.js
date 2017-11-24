const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { join } = require('path');
const imasnek = require('snekfetch');

Canvas.registerFont(join(__dirname, '../../assets/fonts/Corbert-Condensed.otf'), 'Corbert');

module.exports = class Profile extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['balance', 'bal', 'credits'],
			cooldown: 10,
			description: 'Check yours or another\'s profile.',
			usage: '[User:user]'
		});

		this.schema = {
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
		};
	}

	async run(msg, [user = msg.author]) {
		if (user.bot) { return msg.send(`${user.tag} does not have a profile.`); }

		const { balance, level, reputation } = await user.conf;

		const background = await fsn.readFile('./assets/backgrounds/space.jpg');
		const guildCard = await fsn.readFile('./assets/images/profile-card.png');
		const userAvatar = await imasnek.get(user.displayAvatarURL({ format: 'png', size: 256 }));
		const leadboardPosition = this.client.providers.get('collection').getAll('users').sort((a, b) => b.balance - a.balance).keyArray().indexOf(user.id);

		const profileCard = new Canvas(380, 450)
			.addImage(background, 0, 0, 380, 200)
			.addImage(guildCard, 0, 0, 380, 450)
			.save()
			.addImage(userAvatar.body, 130, 55, 125, 125, { type: 'round', radius: 62.5 })
			.restore()
			.setColor('#000')
			.setTextFont('26px Corbert')
			.setTextAlign('center')
			.addText(user.tag, 194, 220)
			.setTextAlign('left')
			.addText(level, 15, 290)
			.addText(`${reputation} points`, 15, 370)
			.setTextAlign('right')
			.addText(Number(balance).toLocaleString(), 365, 290)
			.addText(`#${leadboardPosition + 1}`, 365, 370);

		return msg.channel.send({ files: [{ attachment: profileCard.toBuffer(), name: `${user.tag}-profile.png` }] });
	}


	async validate(userResolvable) {
		const result = await this.resolver.user(userResolvable);
		if (result) return result;
		throw 'The parameter <User> expects either a User ID or a User Object.';
	}

	async init() {
		if (!this.client.settings.users) { await this.client.settings.add('users', this.validate, this.schema); }
	}

};
