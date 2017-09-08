const { Command, version: klasaVersion } = require('klasa');
const moment = require('moment');
require('moment-duration-format');
const os = require('os');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			name: 'stats',
			enabled: true,
			runIn: ['text'],
			cooldown: 0,
			aliases: ['info', 'statistics'],
			permLevel: 0,
			botPerms: ['SEND_MESSAGES'],
			requiredSettings: [],
			description: '',
			usage: '',
			usageDelim: undefined,
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg) {

		const duration = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
		const hostTime = moment.duration(os.uptime() * 1000).format(' D [days], H [hrs], m [mins], s [secs]');
		return msg.sendCode('asciidoc', [
			'= STATISTICS =',
			`• Servers      :: ${this.client.guilds.size.toLocaleString()}`,
			`• Channels     :: ${this.client.channels.size.toLocaleString()}`,
			`• Users        :: ${this.client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`,
			`• Klasa        :: v${klasaVersion}`,
			'• Discord.js   :: v12.0.0-dev',
			`• Node.js      :: ${process.version}`,
			'',
			'= HOST USAGE =',
			`• CPU Load     :: ${Math.round(require('os').loadavg()[0]*10000)/100}%`,
			`• RAM +Node    :: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
			`• RAM Usage    :: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
			`• Uptime       :: ${duration}`,
			`• Host Uptime  :: ${hostTime}`
		]);

	}

};