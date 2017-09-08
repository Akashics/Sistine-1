const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name:'guildCreate', enabled: true });
	}

	run(guild) {
		console.log(guild);
		this.client.emit('log', `New Guild: ${guild.name} - ${guild.membercount}`, 'log');

		let guildLog = '341768632545705986';
		let guildCreateMsg = `
# NEW GUILD

# Guild Name: ${guild.name}
# Guild ID: ${guild.id}
# Guild Count: ${guild.memberCount}

# Guild Owner: ${guild.owner}
# Guild Owner ID: ${guild.ownerID}`;
		this.client.channels.get(guildLog).send(guildCreateMsg, { code: 'md'});
	}

};
