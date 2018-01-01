require('./preloader');
// Lets go ahead and preload everythhing on shard start so that it is available to shards.
/* eslint-disable max-len */
const Discord = require('discord.js');
const moment = require('moment');
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
	webhook(`\`\`\`asciidoc\n= [ Sharding Logger ] =\n ❯ Shard Rebooting :: ${(shard.id + 1)}/${Manager.totalShards}\n ❯ Station :: ${os.hostname()}\n ❯ Date :: ${moment().format('MM-DD-YYYY hh:mm:ss A')}\`\`\``);
});

Manager.spawn();
