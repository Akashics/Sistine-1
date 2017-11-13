const { Command } = require('klasa');
const figletAsync = require('util').promisify(require('figlet'));

module.exports = class asciiBanner extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ascii'],
			description: 'Creates an ASCII banner from the string you supply.',
			usage: '<BannerText:str>'
		});
		this.cost = 10;
	}

	async run(msg, [banner]) {
		const data = await figletAsync(banner);
		return msg.sendCode('', data);
	}

};
