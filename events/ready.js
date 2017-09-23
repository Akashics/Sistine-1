const { Event } = require('klasa');
const { sendStats } = require('../util/Util');

module.exports = class extends Event {

  run() {
    setInterval(() => {
      sendStats(this.client);
    }, 180000);

    this.client.raven.config(this.client.keys.raven).install();

    return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
  }


};
