const { Event } = require('klasa')
const { Canvas } = require('canvas-constructor')
const snek = require('snekfetch')
const { resolve, join } = require('path')

Canvas.registerFont(resolve(join(__dirname, '../assets/fonts/Discord.ttf')), 'Discord')

const MakeWelcomImg = async (person, guildname) => {
  const png = await person.displayAvatarURL({ format: 'png', size: 256 })

  const { body } = await snek.get(png)
  const pName = person.tag
  const WelName = 'WELCOME'
  const enjoyStay = `Enjoy your stay in ${guildname}`
  return new Canvas(1024, 450)
    .addImage(body, 384, 20, 256, 256, { type: 'round', radius: 128 })
    .restore()
    .setTextFont('80px Discord')
    .setColor('#FFFFFF')
    .setTextAlign('center')
    .addText(WelName, (512 - (WelName.length / 2)), 350)
    .setTextFont('38px Discord')
    .addText(pName, (512 - (pName.length / 2)), 388)
    .setTextFont('30px Discord')
    .addText(enjoyStay, (512 - (enjoyStay.length / 2)), 440)
    .toBuffer()
}

module.exports = class extends Event {
  constructor (...args) {
    super(...args, { name: 'guildMemberAdd', enabled: true })
  }

  async run (member) {
    if (!member.guild.settings.logChannel) return
    const welcomemsg =
    [
      `**${member.user.tag}**, if our dog doesn't like you, we won't either !`,
      `Come in **${member.user.tag}**, We are awesome :stuck_out_tongue_winking_eye: !!`,
      `You look hot **${member.user.tag}** :kissing:`,
      `**${member.user.tag}**, Around here NORMAL is just a setting on the Dryer.`,
      `**${member.user.tag}**, Welcome to the Porch... where wasting time is considered.`,
      `**${member.user.tag}**, be WISE ... **Dont DRINK & DRIVE** !!`,
      `Welcom Tursit **${member.user.tag}**, We SPIK INGLISH.`,
      `Oh NO, Not you again **${member.user.tag}**`,
      `**${member.user.tag}**, DOORBELL BROKEN! Yell __"DING DONG"__ Loudly.`,
      `Yay! you made it **${member.user.tag}**, Now the party can start.`,
      `I'm already disturbed, Please come in **${member.user.tag}**.`,
      `**${member.user.tag}**, Forget the DOGS ... **BEWARE OF KIDS** :stuck_out_tongue_winking_eye:`,
      `**${member.user.tag}**, **SIT LONG**, **TALK MUCH**, **LAUGH OFTEN**`,
    ]
    const randomNumber = Math.floor(Math.random() * welcomemsg.length)
    const embedMessage = new this.client.methods.Embed()
      .setColor(0x66CC00)
      .setDescription(welcomemsg[randomNumber])
      .setThumbnail(member.user.displayAvatarURL)
      .setTimestamp()
      .setFooter(this.client.user.username, this.client.user.avatarURL())

    // trying to send the log detail to log channel
    const logChannelID = member.guild.settings.logChannel
    if (!logChannelID) return
    const logLevel = member.guild.settings.playerLogLevel
    try {
      switch (logLevel) {
        case 1:
          member.guild.channels.get(logChannelID).send(welcomemsg[randomNumber])
          break
        case 2:
          member.guild.channels.get(logChannelID).send({ embed: embedMessage })
          break
        case 3:
          member.guild.channels.get(logChannelID).send({ files: [{ attachment: await MakeWelcomImg(member.user, member.guild.name), name: `Welcome_${member.user.tag}.png` }] })
          break
        default:
          break
      }
    } catch (e) {
      console.log(e)
    }
  }
}
