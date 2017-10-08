const { Command } = require('klasa')
const flip = require('flipacoin')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      runIn: ['text'],
      aliases: ['flip'],
      description: 'Flip a coin. Heads or Tails.',
    })
    this.requireMusic = false
  }

  async run (msg) {
    return msg.send(msg.language.get('COINFLIP', flip()))
  }
}
