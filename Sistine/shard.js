require('./preloader');
// Lets go ahead and preload everythhing on shard start so thhat is available to shards.
const Discord = require('discord.js');
const dateFormat = require('dateformat');
const os = require('os');

const webhook = require('./lib/managers/webhooks.js');
const log = require('./lib/managers/logger.js');
const config = require('./config.json');

const Manager = new Discord.ShardingManager('./app.js', {
	totalShards: 'auto',
	token: config.botToken,
	respawn: true
});

Manager.on('shardCreate', shard => {
	log(`Launching: Shard ${shard.id + 1}/${Manager.totalShards}.`);
	webhook(`🗘 **Shard Rebooting:** ${(shard.id + 1)}/${Manager.totalShards} **Station:** ${os.hostname()} **Date:** ${dateFormat(Date.now(), 'MM-DD-YYYY hh:MM:ss TT')}`);
});

Manager.spawn();
