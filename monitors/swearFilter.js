const { Monitor } = require('klasa');

module.exports = class swearFilter extends Monitor {

	constructor(...args) {
		super(...args, {
			enabled: false,
			ignoreBots: true,
			ignoreSelf: true
		});
	}

	run(msg) {
		const { settings } = msg.guild;
		if (!settings.filtering.swearFilter || settings.filtering.swearWords.length === 0) return;
		if (msg.deletable && (new RegExp(settings.filtering.swearWords.join('|'), 'i')).test(msg.content)) msg.delete();
		return;
	}

};
