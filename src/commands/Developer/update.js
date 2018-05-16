const { Command, util: { exec, codeBlock } } = require('klasa');
const { URL } = require('url');

module.exports = class UpdateCommand extends Command {

	constructor(...args) {
		super(...args, {
			permissionLevel: 10,
			description: 'Updates the bo to the new version on Git.'
		});
	}

	async run(msg) {
		const gitURL = new URL(this.client.config.git.url);
		const errRegex = new RegExp(gitURL.toString(), 'g');
		gitURL.username = this.client.config.git.username;
		gitURL.password = this.client.config.git.password;

		const result = await exec(`git pull ${gitURL}`).catch(err => { throw err.message.replace(errRegex, ''); });
		const mess = await msg.send(`Updating!!!!`);
		const output = result.stdout ? `**\`OUTPUT\`**${result.stdout.length >= 1900 ? await this.client.haste(result.stdout, 'sh') : codeBlock('sh', result.stdout)}` : '';
		await mess.edit(output);
		if (!result.stdout.toString().includes('Already up-to-date.')) return this.client.commands.get(`reboot`).run(msg);
	}

};
