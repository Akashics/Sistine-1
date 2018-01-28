const express = require('express');
const app = express();

const moment = require('moment');
require('moment-duration-format');


/* eslint-disable max-len */
module.exports = async (client) => {
	app.get('/api/adminAuth', async (req, res) => {
		const owner = Boolean(req.user.id === client.owner.ownerID);
		return res.json({ owner });
	});

	app.get('/dashboard/:guildID/manage', (req, res) => {
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
		if (!isManaged && !req.session.isAdmin) res.redirect('/');
		return res.json({ guild });
	});

	app.post('/dashboard/:guildID/manage', (req, res) => {
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
		if (!isManaged && !req.session.isAdmin) res.redirect('/');
		return client.settings.guilds.updateMany(guild.id, req.body);
	});

	app.get('/dashboard/:guildID/members', async (req, res) => {
		client.stats.increment('express.request');
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		return res.json({ guild, members: guild.members.array() });
	});

	app.get('/dashboard/:guildID/members/list', async (req, res) => {
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		if (req.query.fetch) {
			await guild.fetchMembers();
		}
		const total = guild.members.size;
		const start = parseInt(req.query.start, 10) || 0;
		const limit = parseInt(req.query.limit, 10) || 50;
		let { members } = guild;

		if (req.query.filter && req.query.filter !== 'null') {
			members = members.filter(meme => {
				meme = req.query.filterUser ? meme.user : meme;
				return meme.displayName.toLowerCase().includes(req.query.filter.toLowerCase());
			});
		}

		if (req.query.sortby) {
			members = members.sort((a, b) => a[req.query.sortby] > b[req.query.sortby]);
		}
		const memberArray = members.array().slice(start, start + limit);

		const returnObject = [];
		for (let i = 0; i < memberArray.length; i++) {
			const meme = memberArray[i];
			returnObject.push({
				id: meme.id,
				status: meme.user.presence.status,
				bot: meme.user.bot,
				username: meme.user.username,
				displayName: meme.displayName,
				tag: meme.user.tag,
				discriminator: meme.user.discriminator,
				joinedAt: meme.joinedTimestamp,
				createdAt: meme.user.createdTimestamp,
				highestRole: { hexColor: meme.highestRole.hexColor },
				memberFor: moment.duration(Date.now() - meme.joinedAt).format(' D [days], H [hrs], m [mins], s [secs]'),
				roles: meme.roles.map(rollingDownTheHill => ({
					name: rollingDownTheHill.name,
					id: rollingDownTheHill.id,
					hexColor: rollingDownTheHill.hexColor
				}))
			});
		}
		return res.json({
			total,
			page: (start / limit) + 1,
			pageof: Math.ceil(members.size / limit),
			members: returnObject
		});
	});

	app.get('/dashboard/:guildID/leave', async (req, res) => {
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
		if (!isManaged && !req.session.isAdmin) res.redirect('/');
		await guild.leave();
		return res.json({ owner: Boolean(req.user.id === client.owner.ownerID) });
	});

	app.get('/dashboard/:guildID/reset', async (req, res) => {
		const guild = client.guilds.get(req.params.guildID);
		if (!guild) return res.status(404);
		const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
		if (!isManaged && !req.session.isAdmin) res.redirect('/');
		return guild.configs.destroy();
	});

	app.get('/api/commands', async (req, res) => {
		const commands = await client.commands.filter((cmd) => cmd.permLevel <= 3);
		return res.json({ commands });
	});

	app.get('/api/stats', async (req, res) => {
		const rethink = await client.providers.default.db('test').table('stats').get('45cfe4d5-7901-4b3e-94ee-1c951a230f25').run();
		const guilds = (await client.shard.fetchClientValues('guilds.size')).reduce((prev, val) => prev + val, 0);
		const users = (await client.shard.fetchClientValues('users.size')).reduce((prev, val) => prev + val, 0);
		const channels = (await client.shard.fetchClientValues('channels.size')).reduce((prev, val) => prev + val, 0);
		return res.json({ stats: { guilds, users, channels, ping: client.ping, status: client.status, uptime: client.uptime, memory: process.memoryUsage().heapUsed / 1024 / 1024, commands: rethink.commands, messages: rethink.messages } });
	});
	app.listen(2018, () => { client.emit('log', '[API] Started on port 2018.'); });
};
