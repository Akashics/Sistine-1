const { Command } = require('klasa');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      runIn: ['text'],

      description: 'Prune the queue list.',
    });

    this.requireMusic = true;
  }

  async run(msg) {
    /* eslint-disable no-throw-literal */
    const { music } = msg.guild;

    if (music.voiceChannel.members.size > 4) {
      const hasPermission = await msg.hasAtLeastPermissionLevel(1);
      if (hasPermission === false) throw msg.language.get('MUSIC_NOTDJ');
    }

    music.prune();
    return msg.send(msg.language.get('MUSIC_PRUNEQ', music.queue.length));// `🗑 Pruned ${music.queue.length}`));
  }

};
