const Discord = require('discord.js');
const log = require('./lib/util/logger');
const config = require('./config.json');

const Manager = new Discord.ShardingManager('./app.js', {
	totalShards: 'auto',
	token: config.token,
	respawn: true
});

Manager.on('shardCreate', shard => {
	log(`Launching: Shard ${shard.id + 1}/${Manager.totalShards}.`);
});

Manager.spawn();
