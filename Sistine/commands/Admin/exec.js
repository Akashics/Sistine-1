const { Command, util } = require('klasa');
const { exec } = require('child_process');
const { haste } = require('../../util/Util');

module.exports = class Exec extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 2,
			aliases: ['sh', 'bash'],
			permLevel: 10,
			description: 'Executes console cmds',
			usage: '<expression:str>'
		});
	}

	async run(msg, [input]) {
		const executeinput = util.clean(input);
		const msgExecute = await msg.send(`Executing ${executeinput}...`);
		exec(input, (err, stdout) => {
			const cleanexec = util.clean(stdout);
			if (err) msgExecute.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Error:\` ${util.codeBlock('bash', err.message)}`);
			if (stdout.length >= 1900) {
				haste(stdout, 'bash').then((result) => {
					msgExecute.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Output:\` **Bash command was over 2000 letters!** ${result}`);
				});
			} else {
				msgExecute.edit(`:inbox_tray:\`Input:\`\n${util.codeBlock('bash', executeinput)}\n:outbox_tray:\`Output:\` ${util.codeBlock('bash', cleanexec)}`);
			}
		});
	}

};
