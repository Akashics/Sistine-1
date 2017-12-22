const dateFormat = require('dateformat');

module.exports = (msg) => {
	console.log(`${dateFormat(Date.now(), 'hh:MM:ss TT')} | ${msg}`);
};
