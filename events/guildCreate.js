const { Event } = require('klasa');
const { dBots, dBotsOrg } = require('../util/Util');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'guildCreate', enabled: true });
  }

  async run(guild) {
    if (this.client.banlist.hasOwnProperty(guild.id)) {
      const sendMsg = [
        'This is a public notice from Akashic\'s records.',
        `__${guild.name}__ was placed on a __'No Serve'__`,
        'guild list for some odd-ball or stupid reason below.',
        'You may appeal with _reasoning_ in our support guild: https://sistine.ml/support',
        '',
        `Reason for Issued Guild Ban: ${this.client.banlist[guild.id]}`,
      ];

      try {
        guild.channels.filter(channel => channel.type === 'text').find(c => c.permissionsFor(guild.me).has(['SEND_MESSAGES'])).send(sendMsg);
      } catch (e) {
        console.log(e);
      }
      await guild.leave();
    }

    this.client.datadog.increment('prod.guildJoin');

    dBots(this.client.guilds.size);
    dBotsOrg(this.client.guilds.size);

    this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
    this.client.emit('log', `New Guild: ${guild.name} - ${guild.memberCount}`, 'log');

    const guildLog = '341768632545705986';
    const guildCreateMsg = `
# Added Guild: ${guild.name}

# Guild ID: ${guild.id}
# Guild Count: ${guild.memberCount}

# Guild Owner: ${guild.owner.user.tag}`;
    this.client.channels.get(guildLog).send(guildCreateMsg, { code: 'md' });
  }

};
