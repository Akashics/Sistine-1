const express = require('express');
const app = express();

/* eslint-disable max-len */
module.exports = async (client) => {
	app.get('/api', async (req, res) => {
		const rethink = await client.providers.default.db('test').table('stats').get('45cfe4d5-7901-4b3e-94ee-1c951a230f25wwwwwwww').run();
		const guilds = (await client.shard.fetchClientValues('guilds.size')).reduce((prev, val) => prev + val, 0);
		const users = (await client.shard.fetchClientValues('users.size')).reduce((prev, val) => prev + val, 0);
		const channels = (await client.shard.fetchClientValues('channels.size')).reduce((prev, val) => prev + val, 0);
		res.json({ stats: { guilds, users, channels, ping: client.ping, status: client.status, uptime: client.uptime, memory: process.memoryUsage().heapUsed / 1024 / 1024, commands: rethink.commands, messages: rethink.messages } });
	});
	app.listen(2018, () => { client.emit('log', '[API] Started on port 2018.'); });
};
