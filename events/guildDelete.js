const { Event } = require('klasa');
const { dBots, dBotsOrg, updateStatus } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildDelete', enabled: true });
  }

  async run(guild) {
    if (this.client.banlist[guild.id]) { return; }
    this.client.datadog.increment('client.guildLeaves');

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);
    updateStatus(this.client);

    this.client.channels.get('341768632545705986').send(`<:tickNo:315009174163685377> Left \`"${guild.name}" (${guild.id})\` with ${guild.memberCount} members owned by \`${guild.owner.user.tag}.\``);
  }

};
