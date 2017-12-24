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
	webhook(`\`${dateFormat(Date.now(), 'hh:MM:ss TT')}\` **Host** ${os.hostname()} Launched Shard \`${(shard.id + 1)}/${Manager.totalShards}\`.`);
});

Manager.spawn();
