const { Command } = require('klasa');
const owjs = require('overwatch-js');

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			cooldown: 5,
			aliases: ['ow'],
			permLevel: 0,
			description: 'Get Overwatch game stats based off a battle tag.',
			usage: '<xbl|psn|pc> <us|eu|kr|cn|global> <BlizzardBattleTag:string>',
			usageDelim: ' ',
			extendedHelp: 'No extended help available.'
		});
	}

	async run(msg, [platform = 'pc', region = 'global', battletag = 'Kyra#11341']) {
		let compData = false;
		let compBuild;
		battletag = battletag.replace(/#/i, '-');
		const owProfile = await owjs.search(battletag);
		if (owProfile.length <= 0) return msg.send(msg.language.get('COMMAND_OVERWATCH_NOTAVAILABLE'));

		const data = await owjs.getOverall(platform, region, battletag);
		if (data.competitive.global.eliminations) {
			compData = true; 
			compBuild = `↪ Medals        :: ${data.competitive.global.medals.toLocaleString()} Total (${data.competitive.global.medals_gold.toLocaleString()} Gold / ${data.competitive.global.medals_silver.toLocaleString()} Silver / ${data.competitive.global.medals_bronze.toLocaleString()} Bronze)
↪ Total Damage  :: ${data.competitive.global.all_damage_done.toLocaleString()}
↪ Total Damage  :: ${data.competitive.global.all_damage_done.toLocaleString()}
↪ Total Healing :: ${data.competitive.global.healing_done.toLocaleString()}
↪ Total Kills   :: ${(data.competitive.global.eliminations).toLocaleString()} (Best Streak: ${data.competitive.global.kill_streak_best.toLocaleString()} kills)
↪ Total Deaths  :: ${data.competitive.global.deaths.toLocaleString()}
↪ Total Wins    :: ${data.competitive.global.games_won.toLocaleString()}
↪ Total Loses   :: ${data.competitive.global.games_lost.toLocaleString()}`
		}
		return msg.sendCode('asciidoc', [
			`= [ ${owProfile[0].platformDisplayName}'s Profile ] =`,
			`↪ Nickname      :: ${data.profile.nick}`,
			`↪ Platform      :: ${owProfile[0].platform.toUpperCase()}-${owProfile[0].region.toUpperCase()}`,
			`↪ Level         :: ${data.profile.level}`,
			`↪ Comp. Ranking :: ${data.profile.rank ? data.profile.rank : 'No competitive data.'} ${data.profile.rank ? `(${data.profile.ranking})` : ''}`,
			`↪ Comp. Tier    :: ${data.profile.tier ? data.profile.tier : 'No tier data.'}`,
			`↪ Achievements  :: ${data.achievements.length.toLocaleString()}`,
			'',
			'= [ Overwatch Quickplay Stats ] =',
			`↪ Medals        :: ${data.quickplay.global.medals.toLocaleString()} Total (${data.quickplay.global.medals_gold.toLocaleString()} Gold / ${data.quickplay.global.medals_silver.toLocaleString()} Silver / ${data.quickplay.global.medals_bronze.toLocaleString()} Bronze)`,
			`↪ Total Cards   :: ${data.quickplay.global.cards.toLocaleString()}`,
			`↪ Total Damage  :: ${data.quickplay.global.all_damage_done.toLocaleString()}`,
			`↪ Total Healing :: ${data.quickplay.global.healing_done.toLocaleString()}`,
			`↪ Total Kills   :: ${(data.quickplay.global.eliminations).toLocaleString()} (Best Streak: ${data.quickplay.global.kill_streak_best.toLocaleString()} kills)`,
			`↪ Total Deaths  :: ${data.quickplay.global.deaths.toLocaleString()}`,
			`↪ Total Wins    :: ${data.quickplay.global.games_won.toLocaleString()}`,
			'',
			'= [ Overwatch Competitive Stats ] =',
			`${compData ? compBuild : 'No competitive data is available for this battletag.'}`
		]);
	}

	async init() {
		// You can optionally define this method which will be run when the bot starts (after login, so discord data is available via this.client)
	}

};
