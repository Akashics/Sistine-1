const { Command } = require('klasa');
const compliments = require('../../util/compliment');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'compliment',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: [],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Compliments a user.',
      usage: '<UserToCompliment:member>',
    });
  }

  async run(msg, [...args]) {
    return msg.send(`${args[0].user.username}, ${compliments[Math.floor(Math.random() * compliments.length)]}`);
  }

};
