const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const app = express();

const port = 6565;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

module.exports = async (client) => {
	app.use((req, res, next) => {
		req.client = client;
		res.client = client;
		next();
	});

	app.use('/', router);
	app.listen(port, () => client.emit('log', `[API] Started on port ${port}`));
};
