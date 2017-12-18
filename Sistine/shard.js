const Discord = require('discord.js');
const dateFormat = require('dateformat');

const webhook = require('./manager/webhooks.js');
const log = require('./manager/logger.js');
const config = require('./keys/keys.json');

const Manager = new Discord.ShardingManager('./app.js', {
	totalShards: 'auto',
	token: config.botToken,
	respawn: true
});

Manager.on('shardCreate', shard => {
	log(`Launching: Shard ${shard.id + 1}/${Manager.totalShards}.`);
	webhook(`<:shard:392052462162280448> \`> ${dateFormat(Date.now(), 'hh:MM:ss TT')}\` **Launching:** Shard ${(shard.id + 1)}/${Manager.totalShards}`);
});

Manager.spawn();
