const { Client, PermissionLevels } = require('klasa');
const Music = require('./Music');
const keys = require('../../keys.json');
const StatsD = require('node-dogstatsd');
const bans = require('../../banlist.json');

const dogstatsd = new StatsD();
const Raven = require('raven');

const permissionLevels = new PermissionLevels()
  .addLevel(0, false, () => true)
  .addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.dj && msg.member.roles.has(msg.guild.settings.dj))
  .addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.modRole && msg.member.roles.has(msg.guild.settings.modRole))
  .addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
  .addLevel(9, true, (client, msg) => msg.author === client.owner)
  .addLevel(10, false, (client, msg) => msg.author === client.owner);

class Sistine extends Client {

  constructor(options) {
    super(Object.assign(options, { permissionLevels }));
    Object.defineProperty(this, 'keys', { value: keys });
    this.dogstatsd = dogstatsd.StatsD;
    this.queue = new Music();
    this.interval = null;
    this.banlist = bans;
    this.raven = Raven;
  }


}

module.exports = Sistine;
