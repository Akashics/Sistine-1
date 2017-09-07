const { Command } = require('klasa');
const { exec } = require('child_process');
const { URL } = require('url');
module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			name: 'exec',
			enabled: true,
			runIn: ['text', 'dm', 'group'],
			cooldown: 2,
			aliases: ['sh', 'bash'],
			permLevel: 10,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: 'Executes console cmds',
			usage: '<expression:str>',
			extendedHelp: 'No extended help available.'
		});
	}
  
	async run(msg) {

		const gitURL = new URL('git@github.com:Kashalls/Sistine.git');
		gitURL.password = 'Ubuntu';
		gitURL.username = 'Ubuntu';

		exec(`git pull ${gitURL}`, (err, stdout) => {
			if (err) return msg.channel.send(err.message, { code: 'fix' });
			return msg.channel.send(stdout, { code: 'fix' }).then(() => {
				process.exit();
			});
		});
	}
};