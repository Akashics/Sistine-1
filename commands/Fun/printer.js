const { Command } = require('klasa');
const ascii = require('image-to-ascii');
const imageHandler = require('../../util/imageHandler');

module.exports = class Cat extends Command {

	constructor(...args) {
		super(...args, {
			botPerms: ['SEND_MESSAGE'],
			description: 'Print out an image.',
			usage: '<text:string{1,500}>'
		});
	}

	async run(msg, [text]) {
		imageHandler.handle(this.client, msg, text, (image) => {
			ascii(image, { colored: false, size: { width: 28, height: 28 } }, (err, result) => {
				if (err) console.log(err);
				return msg.channel.send(`\`\`\`\n${result}\n\`\`\``);
			});
		});
	}

};
