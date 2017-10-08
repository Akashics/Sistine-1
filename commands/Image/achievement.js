const { Command } = require('klasa')
const snekfetch = require('snekfetch')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Provide a string from 1 to 25 and form an Minecraft Achievement.',
      usage: '<Text:string{1,25}>',
    })
  }

  async run (msg, args) {
    const { body } = await snekfetch
      .get('https://www.minecraftskinstealer.com/achievement/a.php')
      .query({
        i: Math.floor((Math.random() * 39) + 1),
        h: msg.language.get('ACHIEVEMENT_GET'),
        t: args,
      })
    return msg.send('', { files: [{ attachment: body, name: 'achievement.png' }] })
  }
}
