const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'achievement',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: ['achieve'],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Provide a string from 1 to 25 and form an Minecraft Achievement.',
      usage: '<Text:string{1,25}>',
      usageDelim: undefined,
      extendedHelp: 'No Extended Help.',
    });
  }

  async run(msg, args) {
    const { body } = await snekfetch
      .get('https://www.minecraftskinstealer.com/achievement/a.php')
      .query({
        i: 1,
        h: msg.language.get('ACHIEVEMENT_GET'),
        t: args,
      });
    return msg.channel.send('', { files: [{ attachment: body, name: 'achievement.png' }] });

  }

};
