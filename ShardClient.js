if (process.version.slice(1).split('.')[0] < 8) throw new Error('Node 8.0.0 or higher is required. Update Node on your system.');
require('./preloader');

const Discord = require('discord.js');
const { fork } = require('child_process');
const Process = require('process-as-promised');

const log = require('./src/lib/util/logger');
const settings = require('./settings.js');

const Dashboard = new Process(fork('./src/dashboard/server.js', [], { stdio: 'inherit' }));
const Manager = new Discord.ShardingManager('./Construct.js', {
	totalShards: 'auto',
	token: settings.token,
	respawn: true
});

Manager.on('shardCreate', (shard) => {
	log(`🐦  Shard ${shard.id + 1}/${Manager.totalShards} was launched.`);
});

Manager.spawn().then(() => {
	Dashboard.on('request', async (data, callback) => {
		log(`Data GET: ${JSON.stringify(data)}`);
		var request;
		if (data.request === 'userManager') {
			if (!data.guild || !data.user) return callback({ message: 'You did not send guild or user data.' });
			request = await Manager.broadcastEval(`this.guilds.has('${data.guild}') ? this.guilds.get('${data.guild}').members.fetch('${data.user}').then(user => user.permissions.has('MANAGE_GUILD')) : null`);
		}
		if (!data.request) {
			request = await Manager.broadcastEval(data.script);
		}
		log(`Data SENT: ${JSON.stringify(request)}`);
		const parsed = JSON.parse(JSON.stringify(request.filter(Boolean)));
		return callback(parsed || { message: 'Unknown Data' });
	});
});
