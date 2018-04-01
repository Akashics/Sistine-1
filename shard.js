require('./preloader');

const Discord = require('discord.js');
const log = require('./lib/managers/logger.js');
const config = require('./config.json');

const Manager = new Discord.ShardingManager('./app.js', {
	totalShards: 'auto',
	token: config.botToken,
	respawn: true
});

Manager.on('shardCreate', shard => {
	log(`Launching: Shard ${shard.id + 1}/${Manager.totalShards}.`);
});

Manager.spawn();
