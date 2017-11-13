const { Command, Stopwatch } = require('klasa');
const { inspect } = require('util');
const discord = require("discord.js"); //eslint-disable-line

module.exports = class extends Command {

	constructor(...args) {
		super(...args, {
			aliases: ['ev'],
			permLevel: 10,
			description: 'Evaluates arbitrary Javascript.',
			usage: '<expression:str>'
		});
	}

	async run(msg, [...code]) {
		const start = new Stopwatch();
		try {
			const evaled = eval(code.join(' '));
			let kashEval = evaled;
			if (evaled instanceof Promise) kashEval = await kashEval;
			if (typeof evaled !== 'string') kashEval = inspect(kashEval, { depth: this.depth, showHidden: true });
			const cleanEval = this.client.methods.util.clean(kashEval);
			if (kashEval.length > 1950) {
				const haste = await this.client.haste(cleanEval, 'js').catch(console.error);
				msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${typeof evaled || evaled.constructor.name}\`
\`Input:\`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\`Output:\` **Evaled code was over 2000 letters Here yo go **${haste}`).catch(console.error);
			} else {
				msg.send(`**Took:** \`${start.stop()}\`, **Typeof:** \`${typeof evaled || evaled.constructor.name}\`
\`Input:\`\n${this.client.methods.util.codeBlock('js', code.join(' '))}
\`Output:\` \`\`\`js
${cleanEval}\`\`\`
`).catch(console.error);
			}
		} catch (err) {
			msg.send(`
**Took:** \`${start.stop()}\n
\`Input:\`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\`ERROR\`
${this.client.methods.util.codeBlock('js', err)}`).catch(console.error);
			if (err.stack) this.client.emit('error', err.stack);
		}
	}

	async init() {
		this.depth = 0;
	}

};
