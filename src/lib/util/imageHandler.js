module.exports = {
	handle: async (bot, msg, text, renderImage) => {
		if (msg.attachments.length >= 1) {
			const img = msg.attachments[0].proxy_url;
			return renderImage(img);
		}
		if (!text && msg.attachments.length === 0) {
			return renderImage(msg.author.avatarURL);
		}
		if (msg.content.match(/\bhttps?:\/\/\S+/i)) {
			const img = msg.content.match(/\bhttps?:\/\/\S+/i)[0];
			return renderImage(img);
		}
		if (msg.content.match(/<a:\S{1,}:[0-9]{16,18}>/)) {
			const emoji = `https://cdn.discordapp.com/emojis/${msg.content.match(/<a:\S{1,}:[0-9]{16,18}>/)[0].replace(/<|a|:\S{1,}:|>/g, '')}.gif`;
			return renderImage(emoji);
		}
		if (msg.content.match(/<:\S{1,}:[0-9]{16,18}>/)) {
			const emoji = `https://cdn.discordapp.com/emojis/${msg.content.match(/<:\S{1,}:[0-9]{16,18}>/)[0].replace(/<|:\S{1,}:|>/g, '')}.png`;
			return renderImage(emoji);
		}
		if (msg.mentions.length >= 1) {
			let avi;
			if (msg.mentions.length >= 2) {
				const usr = msg.mentions.filter((user) => user.id !== '403854965191344139')[0];
				avi = usr.avatarURL;
				return renderImage(avi);
			} else {
				avi = msg.mentions[0].avatarURL;
				return renderImage(avi);
			}
		}
		if (msg.content.match(/[0-9]{16,18}/)) {
			const id = msg.content.match(/[0-9]{16,18}/)[0];
			const avi = bot.users.get(id).avatarURL;
			return renderImage(avi);
		} else {
			try {
				if (msg.channel.guild.members.get(msg.author.id) && msg.channel.guild.members.filter((meme) => meme.username.toLowerCase() === text.toLowerCase())) {
					const avi = msg.channel.guild.members.filter((mem) => mem.username.toLowerCase() === text.toLowerCase())[0].avatarURL;
					return renderImage(avi);
				}
			} catch (error) {
				return msg.send('No image inputted');
			}
		}
		return null;
	}
};
