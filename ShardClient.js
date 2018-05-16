require('./preloader');
const Discord = require('discord.js');
const { fork } = require('child_process');
const Process = require('process-as-promised');

const log = require('./src/lib/util/logger');
const config = require('./config.json');

const Dashboard = new Process(fork('./src/dashboard/server.js', [], { stdio: 'inherit' }));
const Manager = new Discord.ShardingManager('./Construct.js', {
	totalShards: 'auto',
	token: config.token,
	respawn: true
});

Manager.on('shardCreate', (shard) => {
	log(`Launching: Shard ${shard.id + 1}/${Manager.totalShards}.`);
});

Manager.spawn().then(() => {
	Dashboard.on('request', async (data, callback) => {
		log(`Data GET: ${JSON.stringify(data)}`);
		var request;
		if (data.request === 'userManager') {
			if (!data.guild || !data.user) return callback({ message: 'You did not send guild or user data.' });
			request = await Manager.broadcastEval(`this.guilds.has('${data.guild}') ? this.guilds.get('${data.guild}').members.get('${data.user}').permissions.has('MANAGE_GUILD') : null`);
		}
		if (!data.request) {
			request = await Manager.broadcastEval(data.script);
		}
		log(`Data SENT: ${JSON.stringify(request)}`);
		const parsed = JSON.parse(JSON.stringify(request.filter(Boolean)));
		return callback(parsed || { message: 'Unknown Data' });
	});
});
