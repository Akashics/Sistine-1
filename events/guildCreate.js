const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildCreate', enabled: true });
  }

  async run(guild) {
    if (this.client.banlist[guild.id]) { return guild.leave(); }
    this.client.datadog.increment('client.guildJoin');

    const guildCount = await this.client.shard.fetchClientValues('guilds.size');

    dBots(guildCount);
    dBotsOrg(guildCount);
    return updateStatus(this.client);
  }

};
