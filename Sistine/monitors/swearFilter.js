const { Monitor } = require('klasa');

module.exports = class swearFilter extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: true,
			ignoreBots: true,
			ignoreSelf: true,
			ignoreOthers: false
		});
	}

	async run(msg) {
		const { settings } = msg.guild;
		if (!settings.filtering.swearFilter || settings.filtering.swearWords.length === 0) return null;
		if (msg.deletable && (new RegExp(settings.filtering.swearWords.join('|'), 'i')).test(msg.content)) await msg.delete();
		return null;
	}

};
