const Client = require('./util/lib/Client');
const { botToken } = require('./keys.json');
const sistinePermissionLevels = new PermissionLevels()
  .addLevel(0, false, () => true)
  .addLevel(1, false, (client, msg) => msg.guild && msg.guild.settings.dj && msg.member.roles.has(msg.guild.settings.dj))
  .addLevel(2, false, (client, msg) => msg.guild && msg.guild.settings.modRole && msg.member.roles.has(msg.guild.settings.modRole))
  .addLevel(7, false, (client, msg) => msg.guild && msg.member === msg.guild.owner)
  .addLevel(9, true, (client, msg) => msg.author === client.owner)
  .addLevel(10, false, (client, msg) => msg.author === client.owner);

const Sistine = new Client({
  clientOptions: {
    fetchAllMembers: false,
  },
  prefix: 's>',
  cmdEditing: true,
  cmdLogging: true,
  typing: false,
  permissionLevels: sistinePermissionLevels
});

Sistine.login(botToken);
