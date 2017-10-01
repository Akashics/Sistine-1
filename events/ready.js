const { Event } = require('klasa');
const { sendStats, updateStatus } = require('../util/Util');

module.exports = class extends Event {

  run() {
    setInterval(() => {
      sendStats(this.client);
    }, 180000);

    this.client.raven.config(this.client.keys.raven).install();
    updateStatus(this.client);
  }


};
