const { Command } = require('klasa');
const moment = require('moment');
const randomColor = require('randomcolor');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'role',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: [],
      permLevel: 0,
      botPerms: [],
      requiredSettings: [],
      description: 'Get information on a role with an id or a mention.',
      usage: '<Role:role>',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [role]) {
    console.log(role)
    const perms = {
      ADMINISTRATOR: 'Administrator',
      VIEW_AUDIT_LOG: 'View Audit Log',
      MANAGE_GUILD: 'Manage Server',
      MANAGE_ROLES: 'Manage Roles',
      MANAGE_CHANNELS: 'Manage Channels',
      KICK_MEMBERS: 'Kick Members',
      BAN_MEMBERS: 'Ban Members',
      CREATE_INSTANT_INVITE: 'Create Instant Invite',
      CHANGE_NICKNAME: 'Change Nickname',
      MANAGE_NICKNAMES: 'Manage Nicknames',
      MANAGE_EMOJIS: 'Manage Emojis',
      MANAGE_WEBHOOKS: 'Manage Webhooks',
      VIEW_CHANNEL: 'Read Text Channels and See Voice Channels',
      SEND_MESSAGES: 'Send Messages',
      SEND_TTS_MESSAGES: 'Send TTS Messages',
      MANAGE_MESSAGES: 'Manage Messages',
      EMBED_LINKS: 'Embed Links',
      ATTACH_FILES: 'Attach Files',
      READ_MESSAGE_HISTORY: 'Read Message History',
      MENTION_EVERYONE: 'Mention Everyone',
      USE_EXTERNAL_EMOJIS: 'Use External Emojis',
      ADD_REACTIONS: 'Add Reactions',
      CONNECT: 'Connect',
      SPEAK: 'Speak',
      MUTE_MEMBERS: 'Mute Members',
      DEAFEN_MEMBERS: 'Deafen Members',
      MOVE_MEMBERS: 'Move Members',
      USE_VAD: 'Use Voice Activity',
    };
    const allowed = Object.entries(role.serialize()).filter(([perm, allowed]) => allowed).map(([perm]) => perms[perm]).join(', ');

    const send = new this.client.methods.Embed()
      .setColor(role.hexColor || '#FFF')
      .addField('❯ Name', role.name, true)
      .addField('❯ ID', role.id, true)
      .addField('❯ Color', role.hexColor || 'None', true)
      .addField('❯ Creation Date', moment(role.createdAt).format('MMMM Do YYYY'), true)
      .addField('❯ Hoisted', role.hoist ? 'Yes' : 'No', true)
      .addField('❯ Mentionable', role.mentionable ? 'Yes' : 'No', true)
      .addField('❯ Permissions', allowed);
    return msg.channel.send('', { embed: send });

  }

};
