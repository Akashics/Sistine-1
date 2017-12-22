const { Command } = require('klasa');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 6,
			runIn: ['text'],

			description: 'Restarts the music handler.'
		});
	}

	async run(msg) {
		const message = await msg.send(`:headphones: Restarting **${msg.guild.name}**'s Music Manager at the request of **${msg.author.tag}**`);
		this.client.wait(3000);
		await msg.guild.music.destroy();
		return message.edit(`:headphones: Successfully restarted **${msg.guild.name}**'s Music Manager.`);
	}

};
