const Discord = require('discord.js');
const moment = require('moment');
const bodyParser = require('body-parser')
require('moment-duration-format');
const snekfetch = require('snekfetch');
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
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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

app.get('/woah', (req, res) => {
        renderTemplate(res, req, 'woah.ejs');
});

app.get('/commands', async (req, res) => {
	const { body } = await snekfetch.get("https://api.sistine.ml/commands"); //.catch(() => renderTemplate(res, req, 'index.ejs'));
	const commands = JSON.parse(body);
	return renderTemplate(res, req, 'commands.ejs', { commands });
});

app.get("/stats", async (req, res) => {
	const { body } = await snekfetch.get("https://api.sistine.ml/stats").catch(() => renderTemplate(res, req, 'index.ejs'));
    return res.render("stats", { stats: body.stats });
});

app.listen(dashboard.port, () => {
	console.log(`Finished loading dashboard on port ${dashboard.port}.`);
});
