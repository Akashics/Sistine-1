const config = require('../keys/keys.json');

const { WebhookClient } = require('discord.js');
const hooker = new WebhookClient(config.webhook.id, config.webhook.token);

module.exports = (msg) => {
	hooker.send(msg, { disableEveryone: true });
};
