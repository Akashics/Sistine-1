const { Command } = require('klasa')
const snek = require('snekfetch')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      aliases: ['randomdog', 'doggo'],
      description: 'Grabs a random dog image from random.dog.',
    })
  }

  async run (msg) {
    const { body } = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1')
    return msg.channel.send('<:doggoblob:356254351615852544> I found this doggo image. Here you go!', { files: [{ attachment: body.data[0].url, name: `${body.data[0].id}.${body.data[0].format}` }] })
  }
}
