const { Event } = require('klasa');
const { sendStats } = require('../util/Util');

module.exports = class extends Event {

  run() {

    async function createInterval() {
      setInterval(() => {
        sendStats(this.client);
      }, 1000 * 30);
    }
    createInterval();

    this.client.raven.config(this.client.keys.raven).install();

    return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
  }


};
