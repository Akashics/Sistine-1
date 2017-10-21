const url = require('url');
const path = require('path');

// Used for Permission Resolving...
const Discord = require('discord.js');

// Express Session
const express = require('express');
const app = express();
const moment = require('moment');
require('moment-duration-format');

// Express Plugins
// Specifically, passport helps with oauth2 in general.
// passport-discord is a plugin for passport that handles Discord's specific implementation.
const passport = require('passport');
const session = require('express-session');
const { Strategy } = require('passport-discord');
// Used to parse Markdown from things like ExtendedHelp
const md = require('marked');

// Get Dashboard settings file
const settings = require('../keys/dashboard.json');


class Dashboard {

	/* eslint-disable consistent-return */
	static async startDashboard(client) {
		const dataDir = path.resolve(`${process.cwd()}${path.sep}assets/dashboard`);
		const templateDir = path.resolve(`${dataDir}${path.sep}templates`);

		app.use('/public', express.static(path.resolve(`${dataDir}${path.sep}public`)));

		passport.serializeUser((user, done) => {
			done(null, user);
		});
		passport.deserializeUser((obj, done) => {
			done(null, obj);
		});

		passport.use(new Strategy({
			clientID: settings.clientID,
			clientSecret: settings.clientSecret,
			callbackURL: settings.callbackURL,
			scope: ['identify', 'guilds']
		},
		(accessToken, refreshToken, profile, done) => {
			process.nextTick(() => done(null, profile));
		}));


		// Session data, used for temporary storage of your visitor's session information.
		// the `secret` is in fact a "salt" for the data, and should not be shared publicly.
		app.use(session({
			secret: settings.sessionSecret,
			resave: false,
			saveUninitialized: false
		}));

		// Initializes passport and session.
		app.use(passport.initialize());
		app.use(passport.session());

		// The domain name used in various endpoints to link between pages.
		app.locals.domain = settings.domainName;

		// The EJS templating engine gives us more power 
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');

		// body-parser reads incoming JSON or FORM data and simplifies their
		// use in code.
		var bodyParser = require('body-parser');
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));

		/* 
  Authentication Checks. checkAuth verifies regular authentication,
  whereas checkAdmin verifies the bot owner. Those are used in url
  endpoints to give specific permissions. 
  */
		function checkAuth(req, res, next) {
			if (req.isAuthenticated()) { return next(); }
			req.session.backURL = req.url;
			res.redirect('/login');
		}

		function checkAdmin(req, res, next) {
			if (req.isAuthenticated() && req.user.id === client.appInfo.owner.id) { return next(); }
			req.session.backURL = req.originalURL;
			res.redirect('/');
		}

		// Index page. If the user is authenticated, it shows their info
		// at the top right of the screen.
		app.get('/', (req, res) => {
			res.render(path.resolve(`${templateDir}${path.sep}index.ejs`), {
				bot: client,
				auth: !!req.isAuthenticated(),
				user: req.isAuthenticated() ? req.user : null
			});
		});

		app.get('/stats', (req, res) => {
			const duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
			const members = client.guilds.reduce((part, con) => part + con.memberCount, 0);
			const textChannels = client.channels.filter(con => con.type === 'text').size;
			const voiceChannels = client.channels.filter(con => con.type === 'voice').size;
			const guilds = client.guilds.size;
			res.render(path.resolve(`${templateDir}${path.sep}stats.ejs`), {
				bot: client,
				auth: !!req.isAuthenticated(),
				user: req.isAuthenticated() ? req.user : null,
				stats: {
					servers: guilds,
					members: members,
					text: textChannels,
					voice: voiceChannels,
					uptime: duration,
					memoryUsage: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
					dVersion: Discord.version,
					nVersion: process.version
				}
			});
		});

		// The login page saves the page the person was on in the session,
		// then throws the user to the Discord OAuth2 login page.
		app.get('/login', (req, res, next) => {
			if (req.session.backURL) {
				req.session.backURL = req.session.backURL;
			} else if (req.headers.referer) {
				const parsed = url.parse(req.headers.referer);
				if (parsed.hostname === app.locals.domain) {
					req.session.backURL = parsed.path;
				}
			} else {
				req.session.backURL = '/';
			}
			next();
		},
		passport.authenticate('discord'));

		app.get('/callback', passport.authenticate('discord', { failureRedirect: '/autherror' }), (req, res) => {
			if (req.session.backURL) {
				res.redirect(req.session.backURL);
				req.session.backURL = null;
			} else {
				res.redirect('/');
			}
		});

		app.get('/autherror', (req, res) => {
			res.render(path.resolve(`${templateDir}${path.sep}autherror.ejs`), {
				bot: client,
				auth: !!req.isAuthenticated(),
				user: req.isAuthenticated() ? req.user : null
			});
		});

		app.get('/admin', checkAdmin, (req, res) => {
			res.render(path.resolve(`${templateDir}${path.sep}admin.ejs`), {
				bot: client,
				user: req.user,
				auth: true
			});
		});

		app.get('/dashboard', checkAuth, (req, res) => {
			const perms = Discord.EvaluatedPermissions;
			res.render(path.resolve(`${templateDir}${path.sep}dashboard.ejs`), {
				perms,
				bot: client,
				user: req.user,
				auth: true
			});
		});

		app.get('/members/:guildID', checkAuth, async (req, res) => {
			const guildObj = client.guilds.get(req.params.guildID);
			if (!guildObj) { return res.status(404); }
			if (req.param.fetch) {
				await guildObj.fetchMembers();
			}
			res.render(path.resolve(`${templateDir}${path.sep}members.ejs`), {
				bot: client,
				user: req.user,
				auth: true,
				guild: guildObj,
				members: guildObj.members.array()
			});
		});

		app.post('/manage/:guildID', checkAuth, (req, res) => {
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) { return res.status(404); }
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (req.user.id === client.appInfo.owner.id) {
				console.log(`Admin bypass (${req.user.id}) for managing server: ${req.params.guildID}`);
			} else if (!isManaged) {
				res.redirect('/');
			}
			const gsettings = client.settings.guilds.fetchEntry(guild.id);
			for (const key in gsettings) {
				gsettings[key] = req.body[key];
			}
			client.settings.guilds.updateOne(guild.id, gsettings);
			res.redirect(`/manage/${req.params.guildID}`);
		});

		app.get('/manage/:guildID', checkAuth, (req, res) => {
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (req.user.id === client.appInfo.owner.id) {
				console.log(`Admin bypass (${req.user.id}) for managing server: ${req.params.guildID}`);
			} else if (!isManaged) {
				res.redirect('/');
			}
			res.render(path.resolve(`${templateDir}${path.sep}manage.ejs`), {
				bot: client,
				guild: guild,
				user: req.user,
				auth: true
			});
		});

		app.get('/leave/:guildID', checkAuth, async (req, res) => {
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (req.user.id === client.appInfo.owner.id) {
				console.log(`Admin bypass (${req.user.id}) for managing server: ${req.params.guildID}`);
			} else if (!isManaged) {
				res.redirect('/');
			}
			await guild.leave();
			if (req.user.id === client.appInfo.owner.id) {
				return res.redirect('/admin');
			}
			res.redirect('/dashboard');
		});

		app.get('/reset/:guildID', checkAuth, async (req, res) => {
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (req.user.id === client.appInfo.owner.id) {
				console.log(`Admin bypass (${req.user.id}) for managing server: ${req.params.guildID}`);
			} else if (!isManaged) {
				res.redirect('/');
			}
			// client.settings.set(guild.id, client.config.defaultSettings);
			res.redirect(`/manage/${req.params.guildID}`);
		});

		app.get('/commands', (req, res) => {
			res.render(path.resolve(`${templateDir}${path.sep}commands.ejs`), {
				bot: client,
				auth: !!req.isAuthenticated(),
				user: req.isAuthenticated() ? req.user : null,
				md: md
			});
		});

		app.get('/logout', (req, res) => {
			req.logout();
			res.redirect('/');
		});

		client.site = app.listen(settings.dashboardPort, () => {
			client.emit('log', `Dashboard started on ${settings.dashboardPort}`);
		});
	}

}
module.exports = Dashboard;
