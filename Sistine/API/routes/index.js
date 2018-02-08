/* eslint-disable max-len, new-cap */
const express = require('express');
const routes = express.Router();

routes.get('/', async (req, res) => {
	return res.status(200).json({ status: 'OK', message: 'API Key accepted.' });
});

routes.get('/stats', async (req, res) => {
	const rethink = await req.client.providers.default.db('test').table('stats').get('45cfe4d5-7901-4b3e-94ee-1c951a230f25').run();
	const guilds = (await req.client.shard.fetchreq.clientValues('guilds.size')).reduce((prev, val) => prev + val, 0);
	const users = (await req.client.shard.fetchreq.clientValues('users.size')).reduce((prev, val) => prev + val, 0);
	const channels = (await req.client.shard.fetchreq.clientValues('channels.size')).reduce((prev, val) => prev + val, 0);
	return res.json({ stats: { guilds, users, channels, ping: req.client.ping, status: req.client.status, uptime: req.client.uptime, memory: process.memoryUsage().heapUsed / 1024 / 1024, commands: rethink.commands, messages: rethink.messages } });
});

routes.get('/commands', async (req, res) => {
	const data = {};
	req.client.commands.filter((command) => command.permLevel >= 3).forEach(command => {
		if (!data.hasOwnProperty(command.category)) data[command.category] = {};
		data[command.category][command.name] = {
			name: command.name,
			description: command.description,
			aliases: command.aliases,
			permLevel: command.permLevel,
			cost: command.cost,
			usageString: command.usage.nearlyFullUsage
		};
	});

	return res.status(200).json({ data });
});

routes.get('*', (req, res) => {
	return res.status(404).json({ status: 404, message: 'Endpoint not found. Please ensure you are using the correct endpoint.' });
});


module.exports = routes;
