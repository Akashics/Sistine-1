const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			description: (msg) => msg.language.get('COMMAND_MEME_DESCRIPTION')
		});
	}

	async run(msg) {
		const { body } = await snek.get(`https://www.reddit.com/u/kerdaloo/m/dankmemer/top/.json?sort=top&t=day&limit=500`)
		const posts = body.data.children.filter(post => post.data.preview);
		const chosen = posts[Math.floor(Math.random() * posts.length)].data;

		return msg.send(`**"${chosen.title}"**`, { files: [{ attachment: `${chosen.url}` }] });
	}

};
