const { Command } = require('klasa');
const { splitText, showSeconds } = require('../../util/Util');
const getInfo = require('util').promisify(require('ytdl-core').getInfo);

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      runIn: ['text'],

      description: 'Get information from the current song.',
    });
  }

  async run(msg) {
    /* eslint-disable no-throw-literal */
    const { dispatcher, queue, status } = msg.guild.music;
    if (status !== 'playing') throw msg.language.get('MUSIC_NOTPLAYING', status);
    const song = queue[0];
    const info = await getInfo(song.url).catch((err) => { throw err; });
    if (!info.author) info.author = {};
    const playing = new this.client.methods.Embed()
      .setColor(12916736)
      .setTitle(info.title)
      .setURL(`https://youtu.be/${info.vid}`)
      .setAuthor(info.author.name || 'Unknown', info.author.avatar || null, info.author.channel_url || null)
      .setDescription([
        `**${msg.language.get('DURATION')}**: ${showSeconds(parseInt(info.length_seconds) * 1000)} [${msg.language.get('TIME_REMAIN')}: ${showSeconds((parseInt(info.length_seconds) * 1000) - dispatcher.time)}]`,
        `**${msg.language.get('DESCRIPTION')}**: ${splitText(info.description, 500)}`,
      ].join('\n\n'))
      .setThumbnail(info.thumbnail_url)
      .setTimestamp();
    return msg.send('', { embed: playing });
  }

};
