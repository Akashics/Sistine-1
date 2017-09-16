const { Command, util } = require('klasa');
const hastebin = require('hastebin-gen');
const { exec } = require('child_process');

module.exports = class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'exec',
      enabled: true,
      runIn: ['text'],
      cooldown: 2,
      aliases: ['sh', 'bash'],
      permLevel: 10,
      botPerms: ['SEND_MESSAGES'],
      requiredSettings: [],
      description: 'Executes console cmds',
      usage: '<expression:str>',
      extendedHelp: 'No extended help available.',
    });
  }

  async run(msg, [input]) {
    const executeinput = util.clean(input);
    const m = await msg.reply(`Executing ${executeinput}`);
    exec(input, (err, stdout) => {
      const cleanexec = util.clean(stdout);
      if (err) m.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Error:\` ${util.codeBlock('bash', err.message)}`);
      if (stdout.length >= 1850) {
        hastebin(stdout, 'bash').then((r) => { m.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Output:\` **Bash command was over 2000 letters Here yo go **${r}`); });
      } else {
        m.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Output:\` ${util.codeBlock('bash', cleanexec)}`);
      }
    });


  }
};
