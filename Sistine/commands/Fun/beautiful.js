const { Command } = require('klasa');
const { Canvas } = require('canvas-constructor');
const snek = require('snekfetch');
const fsn = require('fs-nextra');

const getBeautiful = async (person) => {
	const plate = await fsn.readFile('./assets/images/plate_beautiful.png');
	const png = person.replace(/\.gif.+/g, '.png');
	const { body } = await snek.get(png);
	return new Canvas(634, 675)
		.setColor('#000000')
		.addRect(0, 0, 634, 675)
		.addImage(body, 423, 45, 168, 168)
		.addImage(body, 426, 382, 168, 168)
		.addImage(plate, 0, 0, 634, 675)
		.toBuffer();
};

module.exports = class Beautify extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['beautify'],
			description: 'Admire the beauty of another user.',
			usage: '[UserMention:user]',
			cooldown: 10
		});
		this.cost = 25;
	}

	async run(msg, [user = msg.author]) {
		const message = await msg.channel.send(`<a:loading:402288838187417601> ${msg.language.get('COMMAND_BEAUTIFUL', user.username)}`);
		const result = await getBeautiful(user.displayAvatarURL({ format: 'png' }));
		await msg.channel.send({ files: [{ attachment: result, name: `${user.username}.jpg` }] });
		return message.delete();
	}

};
