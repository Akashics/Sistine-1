const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'rate-waifu',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: ['waifu'],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Rates your Waifu!',
      usage: '<Waifu:Str>',
    });
  }

  async run(msg, args) {

    return msg.send(msg.language.get('RATE_WAIFU', args[0], Math.floor(Math.random() * 10) + 1));
  }

};
