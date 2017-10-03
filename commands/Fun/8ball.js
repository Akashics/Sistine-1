const { Command } = require('klasa');
const snekfetch = require('snekfetch');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: '8ball',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: ['decide'],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Ask a question, recieve an answer. 100% Random.',
      usage: '<Question:str>',
      usageDelim: undefined,
      extendedHelp: 'No extended help available.',
    });

    this.requireMusic = false;
  }

  async run(msg, [...args]) {
    const params = encodeURIComponent(args);
    const uri = `https://8ball.delegator.com/magic/JSON/${params}`;
    await snekfetch.get(uri)
      .then((r) => { msg.send(msg.language.get('EIGHTBALL_OUTLOOK', r.body.magic.answer)) });
  }
};
