const { Event } = require('klasa');
const { sendStats } = require('../util/Util');

module.exports = class extends Event {

  run() {
    setInterval(() => {
      sendStats(this.client);
    }, 180000);

    this.client.raven.config(this.client.keys.raven).install();

    this.client.user.setPresence({ activity: { name: `sistine.ml | s>help | ${this.client.guilds.size} guilds`, url: 'https://twitch.tv/akashicsrecords', type: 1 } }).catch((err) => {
      this.client.emit('log', err, 'error');
    });
  }


};
