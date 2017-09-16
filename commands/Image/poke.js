const { Command } = require('klasa');
const axios = require('axios');
const { weebKey } = require('../../keys.json');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'poke',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: [],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Allows you to poke another member.',
      usage: '<SomeoneToPoke:member>',
      usageDelim: undefined,
      extendedHelp: 'No Extended Help.',
    });
  }

  async run(msg, [...args]) {

    const image = new this.client.methods.Embed();
    const AuthStr = `Bearer ${weebKey}`;

    let self = false;
    const imageRequest = await axios.get('https://staging.weeb.sh/images/random?type=poke', { headers: { Authorization: AuthStr } });

    if (msg.author.id === args[0].user.id) {
      self = true;
    }
    image
      .setColor(msg.guild.member(msg.author.id).highestRole.color || 0)
      .setImage(imageRequest.data.url)
      .setDescription(self ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'be poked') : msg.language.get('USER_REACTION', msg.author.toString(), args[0].user.toString(), 'poked'))
      .setFooter(msg.language.get('WEEB_SERVICES'));
    return msg.send('', { embed: image });

  }

};
