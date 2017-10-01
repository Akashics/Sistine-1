const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildCreate', enabled: true });
  }

  async run(guild) {
    if (this.client.banlist[guild.id]) { return guild.leave(); }
    this.client.datadog.increment('client.guildJoin');

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);
    updateStatus(this.client);

    return this.client.channels.get('341768632545705986').send(`<:tickYes:315009125694177281> Joined \`"${guild.name}" (${guild.id})\` with ${guild.memberCount} members owned by \`${guild.owner.user.tag}\`.`);
  }

};
