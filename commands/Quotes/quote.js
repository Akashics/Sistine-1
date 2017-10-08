const { Command } = require('klasa')
const axios = require('axios')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      name: 'quote',
      enabled: true,
      runIn: ['text'],
      cooldown: 0,
      aliases: [],
      permLevel: 0,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Fetches a famous quote and posts it.',
      usage: '',
      usageDelim: undefined,
      extendedHelp: 'No Extended Help.',
    })
  }

  async run (msg) {
    const req = await axios.get('https://talaikis.com/api/quotes/random/')
    const embed = new this.client.methods.Embed()
      .setTitle('Random Quote')
      .setColor(msg.member.highestRole.color || 0)
      .setTimestamp()
      .setDescription(`_Requested by ${msg.author.tag}_`)
      .setThumbnail('http://www.freeiconspng.com/uploads/quotes-png-11.png')
      .addField('\u200b', `${req.data.quote} – _${req.data.author}_`)
    return msg.channel.send({ embed })
  }
}
