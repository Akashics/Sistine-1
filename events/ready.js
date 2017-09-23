const { Event } = require('klasa');
const util = require('../util/Util');
const sendStats  = util().sendStats;

module.exports = class extends Event {

  run() {
    const clientObj = this.client;

    async function createInterval() {
      setInterval(() => {
        sendStats(clientObj);
      }, 1000 * 30);
    }
    createInterval();

    this.client.raven.config(this.client.keys.raven).install();

    return this.client.user.setActivity(`s>help — ${this.client.guilds.size} guilds`).catch((err) => {
      this.client.emit('log', err, 'error');
    });
  }


};
