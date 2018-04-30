const { Command } = require('klasa');
const ostb = require('os-toolbox');
const { exec } = require('child_process');

/* eslint-disable max-len */
module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			guarded: true,
			description: (msg) => msg.language.get('COMMAND_STATS_DESCRIPTION')
		});
	}

	async processMemoryMB() {
		const heap = process.memoryUsage().heapUsed;
		const MB = heap / 1048576;
		return Math.floor(MB);
	}

	async regionsUsed() {
		let usa = [];
		let europe = [];
		let russia = [];
		let china = [];
		let brazil = [];
		let japan = [];
		let au = [];
		let sig = [];
		const gC = this.client.guilds.size;
		await this.guilds.map(guild => {
			if (guild.region === 'us-central' || guild.region === 'us-west' || guild.region === 'us-south' || guild.region === 'us-east') {
				usa.push(guild.id);
			}
			if (guild.region === 'eu-central' || guild.region === 'eu-west') {
				europe.push(guild.id);
			}
			if (guild.region === 'russia') {
				russia.push(guild.id);
			}
			if (guild.region === 'hongkong') {
				china.push(guild.id);
			}
			if (guild.region === 'brazil') {
				brazil.push(guild.id);
			}
			if (guild.region === 'japan') {
				japan.push(guild.id);
			}
			if (guild.region === 'sydney') {
				au.push(guild.id);
			}
			if (guild.region === 'signapore') {
				sig.push(guild.id);
			}
		});
		usa.length >= 1 ? usa = usa.length : usa = 0;
		europe.length >= 1 ? europe = europe.length : europe = 0;
		russia.length >= 1 ? russia = russia.length : russia = 0;
		china.length >= 1 ? china = china.length : china = 0;
		brazil.length >= 1 ? brazil = brazil.length : brazil = 0;
		japan.length >= 1 ? japan = japan.length : japan = 0;
		au.length >= 1 ? au = au.length : au = 0;
		sig.length >= 1 ? sig = sig.length : sig = 0;
		function prec(number, precision) {
			var factor = Math.pow(10, precision);
			return Math.round(number * factor) / factor;
		}
		const percentages = `\`${prec((usa / gC) * 100, 2)}%\` of servers are **American**\n\`${prec(((europe + russia) / gC) * 100, 2)}%\` of servers are **European** (\`${prec((russia / gC) * 100, 2)}%\` => **Russia**)\n\`${prec(((china + japan + sig) / gC) * 100, 2)}%\` of servers are **Asian** (\`${prec((china / gC) * 100, 2)}%\` => **China**, \`${prec((japan / gC) * 100, 2)}%\` => **Japan**, \`${prec((sig / gC) * 100, 2)}%\` => **Signapore**)\n\`${prec((brazil / gC) * 100, 2)}%\` of servers are **South American**\n\`${prec((au / gC) * 100, 2)}%\` of servers are **Australian**`;
		const regInfo = `**:flag_us: America**: \`${usa}\`\n**:flag_eu: Europe**: \`${europe + russia}\` (**Russia**: \`${russia}\`)\n**:flag_cn: Asia**: \`${china + japan + sig}\` (**China**: \`${china}\`, **Japan**: \`${japan}\`, **Signapore**: \`${sig}\`)\n**:flag_br: South America**: \`${brazil}\`\n**:flag_au: Australia**: \`${au}\`\n**----- Percentages -----**\n${percentages}`;
		return regInfo;
	}


	async run(msg) {
		const loading = await msg.channel.send('Loading stats, this will take a minute...');
		const guilds = (await this.client.shard.fetchClientValues('guilds.size')).reduce((prev, val) => prev + val, 0);
		const users = (await this.client.shard.fetchClientValues('users.size')).reduce((prev, val) => prev + val, 0);
		const mintime = ostb.uptime() / 60;
		const uptime = Math.floor(mintime / 60);
		const serversLarge = bot.guilds.filter(m => m.large).size;
		const botPing = Math.floor(msg.channel.guild.shard.latency);
		const regionInfo = regionsUsed();

		const { results: stdout } = exec('speedtest-cli --simple');
		const cpu = await ostb.cpuLoad();
		const mem = await ostb.memoryUsage();
		const proc = await ostb.currentProcesses();

		loading.delete();
		msg.channel.createMessage({
			embed: {
				color: 0x36393E,
				author: { name: msg.author.tag, icon_url: msg.author.displayAvatarURL() },
				title: 'Statistics',
				footer: { text: msg.guild.name, icon_url: msg.guild.iconURL() },
				fields: [
					{ name: 'Server Mem. Usage', value: `${mem}%` },
					{ name: 'NodeJS Mem. Usage', value: `${processMemoryMB().toString()} MB` },
					{ name: 'NodeJS Version', value: process.version },
					{ name: 'Shard Count', value: bot.shard.count },
					{ name: 'Guild Count', value: guilds },
					{ name: 'Member Count', value: users },
					{ name: `Shard ${this.client.shard.id} Guild Regions`, value: regionInfo },
					{ name: 'Client Uptime', value: `${Math.floor((bot.uptime / (1000 * 60 * 60)) % 24)} hours` },
					{ name: 'Server Uptime', value: `${JSON.stringify(uptime)} hours` },
					{ name: 'Speed Test Results', value: `\`\`\`\n${stdout}\n\`\`\`` }
				]
			}
		});
	}

};
