const { Command, util } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'reason',
      permLevel: 2,
      runIn: ['text'],
      requiredSettings: ['modlog'],

      description: 'Edit the reason field from a case.',
      usage: '<case:integer> <reason:string> [...]',
      usageDelim: ' ',
    });

    this.provider = null;
  }

  async run(msg, [selected, ...reason]) {
    const reasonFull = reason.length > 0 ? reason.join(' ') : null;

    const modlogs = await this.provider.get('modlogs', msg.guild.id).then(data => data || []);
    const log = modlogs[selected];
    if (!log) return msg.send(msg.language.get('MODLOG_CASE_ERROR'));

    const channel = msg.guild.channels.get(msg.guild.settings.logChannel);
    if (!channel) return msg.send(msg.language.get('MODLOG_NOT_FOUND'));

    const messages = await channel.messages.fetchMessages({ limit: 100 });
    const message = messages.find(mes => mes.author.id === this.client.user.id &&
   mes.embeds.length > 0 &&
   mes.embeds[0].type === 'rich' &&
   mes.embeds[0].footer && mes.embeds[0].footer.text === `${msg.language.get('CASE')} ${selected}`);

    if (message) {
      const embed = message.embeds[0];
      const [type, user] = embed.description.split('\n');
      embed.description = [
        type,
        user,
        `**${msg.language.get('REASON')}**: ${reasonFull}`,
      ].join('\n');
      await message.edit({ embed });
    } else {
      const embed = new this.client.methods.Embed()
        .setAuthor(log.moderator.tag)
        .setColor(ModLog.colour(log.type))
        .setDescription([
          `**${msg.language.get('TYPE')}**: ${log.type}`,
          `**${msg.language.get('USER')}**: ${log.user.tag} (${log.user.id})`,
          `**${msg.language.get('REASON')}**: ${reason}`,
        ])
        .setFooter(`${msg.language.get('CASE')} ${selected}`)
        .setTimestamp();
      await channel.send({ embed });
    }

    const oldReason = log.reason;

    modlogs[selected].reason = reason;
    await this.provider.replace('modlogs', msg.guild.id, modlogs);

    return msg.send(`${msg.language.get('MODLOG_UPDATE_SUCCESS', selected)}.${util.codeBlock('http', [
      `- ${msg.language.get('REASON')} : ${oldReason || msg.language.get('NOT_SET')}`,
      `+ ${msg.language.get('REASON')} : ${reason}`,
    ].join('\n'))}`);
  }

  init() {
    this.provider = this.client.providers.get('json');
  }

};
