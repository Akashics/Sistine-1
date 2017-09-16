const { Command } = require('klasa');
const { writeJSONAtomic } = require('fs-nextra');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'banlist',
      enabled: true,
      runIn: ['text', 'dm'],
      cooldown: 2,
      aliases: [],
      permLevel: 10,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Ban a Guild from Bot Usage.',
      usage: '<GuildIdentifier:guild|GuildID:str> <BannableReason:string> [...]',
      usageDelim: ' ',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [guild, ...reason]) {
    if (guild.id === '324051061033926666') {
      return msg.send('You cannot ban the support guild.');
    }

    const reasonFull = reason.join(this.usageDelim);
    this.client.banlist[guild.id] = reasonFull;
    await writeJSONAtomic('./banlist.json', this.client.banlist);

    const sendMsg = [
      'This is a public notice from Akashic\'s records.',
      `__${guild.name}__ was placed on a __'No Serve'__`,
      'guild list for some odd-ball or stupid reason below.',
      'You may appeal with _reasoning_ in our support guild: https://sistine.ml/support',
      '',
      `Reason for Issued Guild Ban: ${reasonFull}.\nThe bot has been removed from your guild.`,
    ];
    try {
      this.client.get(guild.id).channels.filter(channel => channel.type === 'text').find(c => c.permissionsFor(guild.me).has(['SEND_MESSAGES'])).send(sendMsg);
    } catch (e) {
      console.log(e);
    }
    return this.client.get(guild.id).leave();
  }
};
