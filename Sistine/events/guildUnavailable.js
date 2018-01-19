const { Event } = require('klasa');
const webhook = require('../lib/managers/webhooks');

module.exports = class extends Event {

	run(guild) {
		this.client.emit('error', `Guild Outage: ${guild.name}`);
		webhook(`\`\`\`tex\n$ [GUILD OUTAGE] Detected an outage after attempting to respond.\`\`\``);
	}

};
