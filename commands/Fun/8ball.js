const { Command } = require('klasa')
const snekfetch = require('snekfetch')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['decide'],
      description: 'Ask a question, recieve an answer. 100% Random.',
      usage: '<Question:str>',
    })
  }

  async run (msg, [...args]) {
    const params = encodeURIComponent(args)
    const uri = `https://8ball.delegator.com/magic/JSON/${params}`
    await snekfetch.get(uri)
      .then((r) => { msg.send(msg.language.get('EIGHTBALL_OUTLOOK', r.body.magic.answer)) })
  }
}
