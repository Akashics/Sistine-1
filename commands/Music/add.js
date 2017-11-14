const { Command } = require('klasa');
const snekfetch = require('snekfetch');

const fetchURL = (url, client) => snekfetch.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${url}&key=${client.keys.googleSearch}`)
	.then(result => result.body);

module.exports = class Add extends Command {

	constructor(...args) {
		super(...args, {
			runIn: ['text'],
			usage: '<url:string>',
			description: 'Adds a song the the queue.'
		});
		this.cost = 1;
		this.regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/\S*(?:(?:\/e(?:mbed)?)?\/|watch\/?\?(?:\S*?&?v=))|youtu\.be\/)([\w-]{11})(?:[^\w-]|$)/;
	}

	async run(msg, [url]) {
		/* eslint-disable no-throw-literal */
		this.client.stats.increment('music.trackAdded');

		const youtubeURL = await this.getURL(url, this.client);
		if (!youtubeURL) { throw msg.language.get('MUSIC_URL_NOTFOUND'); }

		const { music } = msg.guild;
		const song = await music.add(msg.author, youtubeURL);

		return msg.send(msg.language.get('MUSIC_ADDED_QUEUE', song));
	}

	async getURL(url, client) {
		const id = this.regExp.exec(url);
		if (id) { return `https://youtu.be/${id[1]}`; }
		const data = await fetchURL(encodeURIComponent(url), client);
		const video = data.items.find(item => item.id.kind !== 'youtube#channel');

		return video ? `https://youtu.be/${video.id.videoId}` : null;
	}

};
