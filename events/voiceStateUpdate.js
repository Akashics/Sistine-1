const { Event } = require('klasa');

module.exports = class extends Event {

  constructor(...args) {
    super(...args, { name: 'voiceStateUpdate', enabled: false });
  }

  async run(old, new) {

  }

};
