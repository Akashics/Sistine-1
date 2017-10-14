const axios = require('axios');
const keys = require('../keys.json');

class anilist {

	/* eslint-disable camelcase */
	static async loadCharacters(id, type) {
		const authRequest = await axios.post('https://anilist.co/api/auth/access_token', {
			grant_type: 'client_credentials',
			client_id: keys.anilistClient,
			client_secret: keys.anilistSecret
		});

		const characterRequest = await axios({
			url: `https://anilist.co/api/${type}/${id}/characters`,
			params: { access_token: authRequest.data.access_token }
		});
		return characterRequest.data.characters;
	}

	static async search(search, type) {
		const authRequest = await axios.post('https://anilist.co/api/auth/access_token', {
			grant_type: 'client_credentials',
			client_id: keys.anilistClient,
			client_secret: keys.anilistSecret
		});

		const request = await axios({
			url: `https://anilist.co/api/${type}/search/${encodeURI(search)}`,
			params: { access_token: authRequest.data.access_token }
		});
		return request;
	}

	static buildResponse(msg, data, characters, type) {
		let description = data.description.replace(/<br>/g, '');
		description = description.replace(/\n|\\n/g, '');
		description = description.replace(/&mdash;/g, '');
		description = description.replace(/&#039;/g, '');
		description = description.split('.').join('.\n\n');
		if (description.length > 720) {
			description = description.substring(0, 716);
			description += '...';
		}
		const mainCharacters = characters.filter(char => char.role === 'Main');
		let characterString = mainCharacters.map(mainC => `[${mainC.name_first}${mainC.name_last ? ` ${mainC.name_last}` : ''}](https://anilist.co/character/${mainC.id})`);
		characterString = characterString.join(', ');
		const titleString = data.title_english !== data.title_romaji ? `${data.title_romaji} | ${data.title_english}` : data.title_romaji;
		let dataTotal;
		let mediaType;
		switch (type) {
			case 'Manga':
				dataTotal = data.total_chapters;
				mediaType = 'Chapters';
				break;
			case 'Anime':
				dataTotal = data.total_episodes;
				mediaType = 'Episodes';
				break;
			default:
				break;
		}
		return {
			title: titleString,
			description: description,
			url: `https://anilist.co/${type}/${data.id}/`,
			color: 0x00ADFF,
			footer: { text: `⭐ ${type} Rating: ${data.average_score}/100` },
			thumbnail: { url: data.image_url_med },
			fields: [
				{
					name: ':movie_camera: Genre',
					value: `${data.genres.join(', ')}`,
					inline: 'true'
				},
				{
					name: `:1234: # of ${mediaType}`,
					value: `${dataTotal > 0 ? dataTotal : 'Unknown'}`,
					inline: 'true'
				},
				{
					name: ':man_dancing: Main Characters',
					value: `**${characterString}**`
				}
			]
		};
	}

}
module.exports = anilist;
