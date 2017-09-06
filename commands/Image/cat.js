const { Command } = require('klasa');
const snek = require('snekfetch');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'cat',
            enabled: true,
            runIn: ['text'],
            cooldown: 0,
            aliases: ['randomcat'],
            permLevel: 0,
            botPerms: ['SEND_MESSAGES'],
            requiredSettings: [],
            description: 'Posts a random cat image.',
            usage: '',
            usageDelim: undefined,
            extendedHelp: 'This command grabs a random cat from "http://random.cat/meow".'
        });
    }

    async run(msg, [...params]) {
        try {
            const msg = await message.channel.send('`Fetching random cat...`');
            const {body} = await snek.get('http://random.cat/meow');
            await message.channel.send({files: [{attachment: body.file, name: `cat.${body.file.split('.')[2]}`}]});
            await msg.delete();
          } catch (e) {
            console.log(e);
          }
    }

};