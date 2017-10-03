const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'echo',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: [],
      permLevel: 10,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Says what you want to say. Deletes message if permission is available.',
      usage: '<WhatToSay:string>',
      usageDelim: undefined,
      extendedHelp: 'No extended help available.',
    });
    this.requireMusic = false;
  }

  async run(msg, [...args]) {

    if (msg.deletable) {
      msg.delete();
    }
    return msg.send(args);
  }
};
