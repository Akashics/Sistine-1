const { Command } = require('klasa')
const axios = require('axios')
const { weebKey } = require('../../keys.json')

module.exports = class extends Command {
  constructor (...args) {
    super(...args, {
      runIn: ['text'],
      description: 'Allows you to cuddle with another member.',
      usage: '[SomeoneToCuddle:member]',
    })
  }

  async run (msg, [mention]) {
    const users = mention || msg.member
    let userIsSelf = false
    const { data } = await axios.get('https://staging.weeb.sh/images/random?type=cuddle', { headers: { Authorization: `Bearer ${weebKey}` } })

    if (msg.author.id === users.user.id) {
      userIsSelf = true
    }
    const image = new this.client.methods.Embed()
      .setColor(msg.member.highestRole.color || 0)
      .setImage(data.url)
      .setDescription(userIsSelf ? msg.language.get('USER_REACTION_SOLO', msg.author.toString(), 'cuddle') : msg.language.get('USER_REACTION', msg.author.toString(), users.user.toString(), 'cuddled'))
      .setFooter(msg.language.get('WEEB_SERVICES'))
    return msg.sendEmbed(image)
  }
}
