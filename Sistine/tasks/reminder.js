const { Task, Timestamp } = require('klasa');

module.exports = class Reminder extends Task {

	async run({ user, text, from }) {
		return user.send(`<a:ditto:393547954168004608> ${user.username}, you asked me to remind you to \`${text}\` about ${Timestamp.toNow(from)} from now.`);
	}

};
