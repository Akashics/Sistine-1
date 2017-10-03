const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'avatar',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: ['avtr'],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Fetches a mentioned user\'s avatar.',
      usage: '<GuildMember:member>',
    });
  }

  async run(msg, [args]) {
    if (!args.user.avatar) return msg.send(msg.language.get('NO_AVATAR'));
    const avatar = args.user.displayAvatarURL({
      format: args.user.avatar.startsWith('a_') ? 'gif' : 'png',
      size: 2048,
    });
    return msg.send(avatar);
  }

};
