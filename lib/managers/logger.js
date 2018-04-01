const moment = require('moment');

module.exports = (msg) => {
	console.log(`${moment().format('MM-DD-YYYY hh:mm:ss A')} | ${msg}`);
};
