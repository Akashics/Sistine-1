const { Extendable } = require('klasa');

module.exports = class extends Extendable {

	constructor(...args) {
		super(...args, ['User'], {
			name: 'conf',
			enabled: true
		});
	}

	get extend() {
		return this.client.settings.users.getEntry(this.id);
	}

};
