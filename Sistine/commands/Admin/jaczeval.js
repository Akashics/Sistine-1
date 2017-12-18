const { Command, Stopwatch } = require('klasa');
const { inspect } = require('util');
const { post } = require('snekfetch');
const discord = require('discord.js');

module.exports = class EvalCommand extends Command {

	constructor(...args) {
		super(...args, {
			permLevel: 10,
			description: 'Evaluates arbitrary Javascript.',
			usage: '<expression:str>'
		});
	}


	async run(msg, [...code]) {
        const client = msg.client; // eslint-disable-line
        const guild = msg.guild; // eslint-disable-line 
        const settings = this.client.gateways; // eslint-disable-line
		const start = new Stopwatch();
		try {
			const evaled = eval(code.join(' '));
			let ogeval = evaled;
			if (evaled instanceof Promise) ogeval = await ogeval;
			if (typeof evaled !== 'string') ogeval = inspect(ogeval, { depth: this.depth, showHidden: true });
			const cleanEval = this.client.methods.util.clean(ogeval);
			if (ogeval.length > 1950) {
				const haste = await this.haste(cleanEval, 'js').catch(console.error);
				msg.send(`**Took:** \` ${start.stop()} \`, **Typeof:** \` ${this.getComplexType(evaled).type} \`
\` Input: \`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\` Output: \` **Evaled code was over 2000 letters.** ${haste}`).catch(console.error);
			} else {
				msg.send(`**Took:** \` ${start.stop()} \`, **Typeof:** \` ${this.getComplexType(evaled).type} \`
\` Input: \`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\` Output: \`
${this.client.methods.util.codeBlock('js', cleanEval)}
`).catch(console.error);
			}
		} catch (err) {
			msg.send(`
**Took:** \` ${start.stop()} \`
\` Input: \`
${this.client.methods.util.codeBlock('js', code.join(' '))}
\` Error: \`
${this.client.methods.util.codeBlock('js', err)}`).catch(console.error);
			if (err.stack) this.client.emit('error', err.stack);
		}
	}

	async init() {
		this.depth = 1;
	}

	getType(value) {
		if (value === null) return String(value);
		return typeof value;
	}

	getComplexType(value) {
		const basicType = this.getType(value);
		if (basicType === 'object' || basicType === 'function') return { basicType, type: this.getClass(value) };
		return { basicType, type: basicType };
	}

	getClass(value) {
		return value && value.constructor && value.constructor.name ?
			value.constructor.name :
			{}.toString.call(value).match(/\[object (\w+)\]/)[1];
	}

	haste(input, extension) {
		return new Promise((res, rej) => {
			if (!input) rej('Input argument is required.');
			post('https://hastebin.com/documents').send(input).then(body => {
				res(`https://hastebin.com/${body.body.key}${extension ? `.${extension}` : ''}`);
			}).catch((error) => rej(error));
		});
	}

};
