const { Client, PermissionLevels } = require('klasa')
const Music = require('./util/lib/Music')
const keys = require('./keys.json')
const bans = require('./banlist.json')
const { StatsD } = require('node-dogstatsd')
const Raven = require('raven')

const dogstatsd = new StatsD()

const sistinePermissionLevels = new PermissionLevels()
  .addLevel(0, false, () => true)
  .addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.dj && msg.member.roles.has(msg.guild.settings.dj))
  .addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.modRole && msg.member.roles.has(msg.guild.settings.modRole))
  .addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
  .addLevel(9, true, (client, msg) => msg.author === client.owner)
  .addLevel(10, false, (client, msg) => msg.author === client.owner)

class SistineClient extends Client {
  constructor (options) {
    super(Object.assign(options, { sistinePermissionLevels }))
    Object.defineProperty(this, 'keys', { value: keys })

    this.datadog = dogstatsd
    this.queue = new Music()
    this.banlist = bans
    this.raven = Raven
  }
}

const Sistine = new SistineClient({
  clientOptions: {
    fetchAllMembers: false,
  },
  prefix: 's>',
  cmdEditing: true,
  cmdLogging: true,
  typing: false,
  permissionLevels: sistinePermissionLevels,
})

Sistine.login(keys.dev ? keys.betaBotToken : keys.botToken)
