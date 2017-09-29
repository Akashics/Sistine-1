const { Command } = require('klasa');
const { announcement } = require('../../util/Util');

module.exports = class extends Command {

  constructor(...args) {
    super(...args, {
      name: 'unsubscribe',
      permLevel: 0,
      runIn: ['text'],

      description: 'Unsubscribe to this servers\' announcements.',
    });
  }

  async run(msg) {
    if (msg.guild.id !== '324051061033926666') return;
    const role = announcement(msg);
    await msg.member.removeRole(role);
    msg.send(msg.language.get('COMMAND_UNSUBSCRIBE_SUCCESS', role.name));
  }

};
