const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'server',
            enabled: true,
            runIn: ['text', 'dm', 'group'],
            cooldown: 0,
            aliases: [],
            permLevel: 0,
            botPerms: [],
            requiredSettings: [],
            description: '',
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'No extended help available.'
        });
    }

    async run(msg, [...args]) {

        const moment = require('moment');
        const embed = new this.client.methods.Embed();
        const filterLevels = [
            'Off',
            'No Role',
            'Everyone'
        ];
        const verificationLevels = [
            'None',
            'Low',
            'Medium',
            '(╯°□°）╯︵ ┻━┻',
            '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        ];
        embed
            .setColor(0x00AE86)
            .setThumbnail(msg.guild.iconURL())
            .addField('❯ Name',
                msg.guild.name, true)
            .addField('❯ ID',
                msg.guild.id, true)
            .addField('❯ Creation Date',
                moment(msg.guild.createdAt).format('MMMM Do YYYY'), true)
            .addField('❯ Region',
                msg.guild.region, true)
            .addField('❯ Explicit Filter',
                filterLevels[msg.guild.explicitContentFilter], true)
            .addField('❯ Verification Level',
                verificationLevels[msg.guild.verificationLevel], true)
            .addField('❯ Owner',
                msg.guild.owner ? msg.guild.owner.user.username : 'None', true)
            .addField('❯ Members',
                msg.guild.memberCount, true);
        return msg.send(embed);

    }

};