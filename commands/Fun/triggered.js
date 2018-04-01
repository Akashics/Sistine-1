const { Command } = require('klasa');
const Canvas = require('canvas');
const snek = require('snekfetch');
const { readFile } = require('fs-nextra');
const GIFEncoder = require('gifencoder');

module.exports = class Crush extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['trigger'],
			description: (msg) => msg.language.get('COMMAND_TRIGGERING_DESCRIPTION'),
			usage: '[UserMentionOrID:user]',
			cooldown: 10
		});
	}
	/* eslint-disable new-cap */
	async run(msg, [user = msg.author]) {
		const message = await msg.channel.send(msg.language.get('COMMAND_TRIGGERING', user.tag));
		const attachment = await this.getTriggered(user.displayAvatarURL({ format: 'png', size: 512 }));
		await msg.channel.send({ files: [{ attachment, name: 'triggered.gif' }] });
		return message.delete();
	}

	streamToArray(stream) {
		if (!stream.readable) return Promise.resolve([]);
		return new Promise((resolve, reject) => {
			const array = [];

			function onData(data) {
				array.push(data);
			}

			function onEnd(error) {
				if (error) reject(error);
				else resolve(array);
				cleanup();
			}

			function onClose() {
				resolve(array);
				cleanup();
			}

			function cleanup() {
				stream.removeListener('data', onData);
				stream.removeListener('end', onEnd);
				stream.removeListener('error', onEnd);
				stream.removeListener('close', onClose);
			}

			stream.on('data', onData);
			stream.on('end', onEnd);
			stream.on('error', onEnd);
			stream.on('close', onClose);
		});
	}


	async getTriggered(triggered) {
		const imgTitle = new Canvas.Image();
		const imgTriggered = new Canvas.Image();
		const encoder = new GIFEncoder(256, 256);
		const canvas = new Canvas.createCanvas(256, 256);
		const ctx = canvas.getContext('2d');

		imgTitle.src = await readFile('./assets/images/plate_triggered.png');
		imgTriggered.src = await snek.get(triggered).then(res => res.body);

		const stream = encoder.createReadStream();
		encoder.start();
		encoder.setRepeat(0);
		encoder.setDelay(50);
		encoder.setQuality(200);

		const coord1 = [-25, -33, -42, -14];
		const coord2 = [-25, -13, -34, -10];

		// await this.client.wait(60000);
		for (let i = 0; i < 4; i++) {
			ctx.drawImage(imgTriggered, coord1[i], coord2[i], 300, 300);
			ctx.fillStyle = 'rgba(255 , 100, 0, 0.4)';
			ctx.drawImage(imgTitle, 0, 218, 256, 38);
			ctx.fillRect(0, 0, 256, 256);
			encoder.addFrame(ctx);
		}

		encoder.finish();
		return this.streamToArray(stream).then(Buffer.concat);
	}

};
