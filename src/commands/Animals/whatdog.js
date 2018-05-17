const { Command } = require('klasa');
const { MessageEmbed } = require('discord.js');
const wd = require('what-dog');

module.exports = class WhatDog extends Command {

	constructor(...args) {
		super(...args, {
			description: 'find out a dog\'s breed by inputting a photo of a dog',
			usage: '<ImageURL:url>'
		});
	}

	async run(msg, [url]) {
		const embed = new MessageEmbed()
			.setColor('purple')
			.setImage(url)
			.setFooter(msg.author.name, msg.author.displayAvatarURL());
		wd(url)
			.then(doggyData => {
				embed.addField('Breed', doggyData.breed, true)
					.addField('About', doggyData.about);

				return msg.send('', { embed });
			})
			.catch((error) => msg.send(error));
	}

};

