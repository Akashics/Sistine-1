const { Event } = require('klasa');
const { dBots, dBotsOrg } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildDelete', enabled: true });
  }

  run(guild) {
    if (this.client.banlist.hasOwnProperty(guild.id)) { return; }

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);
    this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
    this.client.emit('log', `Deleted Guild: ${guild.name} - ${guild.memberCount}`, 'log');

    const guildLog = '341768632545705986';
    const guildDeleteMsg = `
# Removed Guild : ${guild.name}

# Guild ID: ${guild.id}
# Guild Count: ${guild.memberCount}

# Guild Owner: ${guild.owner.user.tag}`;
    this.client.channels.get(guildLog).send(guildDeleteMsg, { code: 'md' });
  }

};
