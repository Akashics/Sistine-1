const { Event } = require('klasa');
const { dBots, dBotsOrg } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildDelete', enabled: true });
  }

  run(guild) {
    if (this.client.banlist.hasOwnProperty(guild.id)) { return; }

    this.client.datadog.increment('client.guildLeaves');

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);

    this.client.user.setActivity(`sistine.ml | s>help ${this.client.guilds.size}`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
    
    this.client.channels.get('341768632545705986').send(`<:tickNo:315009174163685377> Left \`"${guild.name}" (${guild.id})\` with ${guild.memberCount} members owned by \`${guild.owner.user.tag}.\``);
  }
};
