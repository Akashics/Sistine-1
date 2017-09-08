const { Event } = require('klasa');

module.exports = class extends Event {

	constructor(...args) {
		super(...args, { name:'guildDelete', enabled: true });
	}

	run(guild) {
		console.log(guild);
		this.client.emit('log', `Deleted Guild: ${guild.name} - ${guild.membercount}`, 'log');
        
		let guildLog = '341768632545705986';
		let guildDeleteMsg = `
# Lost a Guild :/

# Guild Name: ${guild.name}
# Guild ID: ${guild.id}
# Guild Count: ${guild.memberCount}

# Guild Owner: ${guild.owner}
# Guild Owner ID: ${guild.ownerID}`;
		this.client.channels.get(guildLog).send(guildDeleteMsg, { code: 'md'});
	}

};
