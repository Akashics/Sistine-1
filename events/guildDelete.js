const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name:'guildDelete', enabled: true });
	}

	run(guild) {
		this.client.emit('log', `Deleted Guild: ${guild.name} - ${guild.memberCount}`, 'log');
        
		let guildLog = '341768632545705986';
		let guildDeleteMsg = `
# Removed Guild : ${guild.name}

# Guild ID: ${guild.id}
# Guild Count: ${guild.memberCount}

# Guild Owner: ${guild.owner.user.tag}`;
		this.client.channels.get(guildLog).send(guildDeleteMsg, { code: 'md'});
	}

};
