const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const url = require('url');
const path = require('path');
const compression = require('compression');
const express = require('express');
const app = express();
const helmet = require('helmet');
const { dashboard } = require('./keys.json');
const dataDir = path.resolve(`${process.cwd()}`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);


app.use('/public', express.static(path.resolve(`${dataDir}${path.sep}public`)));

app.use(helmet());

// body-parser reads incoming JSON or FORM data and simplifies their
// use in code.
app.use(compression());

// The domain name used in various endpoints to link between pages.
app.locals.domain = dashboard.domainName;

// The EJS templating engine gives us more power
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const renderTemplate = (res, req, template, data = {}) => {
	res.header('X-FRAME-OPTIONS', 'ALLOW');
	const baseData = {
		path: req.path
	};
	res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
};

app.get('/', (req, res) => {
	renderTemplate(res, req, 'index.ejs');
});

app.get('/commands', (req, res) => {
	const thing = require('./commands.json');
	const commands = Object.values(thing)
	renderTemplate(res, req, 'commands.ejs', { commands });
});

app.get('/stats', (req, res) => {
	res.redirect('https://p.datadoghq.com/sb/82a5d5fef-1a21d0b3a5');
});

app.listen(dashboard.port, () => {
	console.log(`Finished loading dashboard on port ${dashboard.port}.`);
});