const { Command, Stopwatch } = require('klasa');
const { inspect } = require('util');
const discord = require("discord.js"); //eslint-disable-line
const { post } = require('snekfetch');

module.exports = class EvalCommand extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary Javascript.',
			usage: '<expression:str>'
		});
	}

	async run(msg, [...code]) {
        const client = msg.client; // eslint-disable-line
        const guild = msg.guild; // eslint-disable-line 
        const settings = this.client.settings; // eslint-disable-line
		const start = new Stopwatch();
		try {
			const evaled = eval(code.join(' '));
			let ogeval = evaled;
			if (evaled instanceof Promise) ogeval = await ogeval;
			if (typeof evaled !== 'string') ogeval = inspect(ogeval, { depth: this.depth, showHidden: true });
			const cleanEval = this.client.methods.util.clean(ogeval);
			if (ogeval.length > 1950) {
				const haste = await this.haste(cleanEval, 'js').catch(console.error);
				msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${evaled.constructor.name || typeof evaled}\`
\`Input:\`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\`Output:\` **Evaled code was over 2000 letters Here yo go **${haste}`).catch(console.error);
			} else {
				msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${evaled.constructor.name || typeof evaled}\`
\`Input:\`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\`Output:\`
${this.client.methods.util.codeBlock('js', cleanEval)}
`).catch(console.error);
			}
		} catch (err) {
			msg.send(`
**Took:** \`${start.stop()}\`
\`Input:\`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\`Error:\`
${this.client.methods.util.codeBlock('js', err)}`).catch(console.error);
			if (err.stack) this.client.emit('error', err.stack);
		}
	}

	async init() {
		this.depth = 0;
	}

	haste(input, extension) {
		return new Promise((res, rej) => {
			if (!input) rej('Input argument is required.');
			post('https://hastebin.com/documents').send(input).then(body => {
				res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ''}`);
			}).catch(e => rej(e));
		});
	}

};
