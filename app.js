const Client = require('./util/lib/Client');
const { botToken } = require('./keys.json');

const Sistine = new Client({
	clientOptions: {
		fetchAllMembers: false
	},
	prefix: 's>',
	cmdEditing: true,
	cmdLogging: true,
	typing: true
});

Sistine.login(botToken);