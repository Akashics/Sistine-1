const { Command } = require('klasa');
const roasts = require('../../util/roast');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'roast',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: ['roastme'],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Roasts a user.',
      usage: '<UserToRoast:member>',
    });
  }

  async run(msg, [member]) {

    return msg.send(`${member.user.username}, ${roasts[Math.floor(Math.random() * roasts.length)]}`);

  }

};
