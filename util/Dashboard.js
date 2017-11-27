const Discord = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const url = require('url');
const path = require('path');

const compression = require('compression');
const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const RDBStore = require('express-session-rethinkdb')(session);
const { Strategy } = require('passport-discord');
const md = require('marked');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');

const { dashboard, rethinkdb } = require('../keys/keys.json');
const dataDir = path.resolve(`${process.cwd()}${path.sep}dashboard`);
const templateDir = path.resolve(`${dataDir}${path.sep}templates`);


class Dashboard {

	/* eslint-disable consistent-return, new-cap */
	static async startDashboard(client) {
		String.prototype.toProperCase = function prop() {
			return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
		};

		app.use('/public', express.static(path.resolve(`${dataDir}${path.sep}public`)));

		passport.serializeUser((user, done) => {
			done(null, user);
		});
		passport.deserializeUser((obj, done) => {
			done(null, obj);
		});

		// See: https://discordapp.com/developers/docs/topics/oauth2
		passport.use(new Strategy({
			clientID: '353929487018229762',
			clientSecret: dashboard.clientSecret,
			callbackURL: dashboard.callbackURL,
			scope: ['identify', 'guilds']
		},
		(accessToken, refreshToken, profile, done) => {
			process.nextTick(() => done(null, profile));
		}));


		// Session data, used for temporary storage of your visitor's session information.
		// the `secret` is in fact a "salt" for the data, and should not be shared publicly.
		const rdbStore = new RDBStore({
			connectOptions: {
				servers: [
					{ host: rethinkdb.host, port: rethinkdb.port, user: rethinkdb.user, password: rethinkdb.password }
				],
				db: rethinkdb.database,
				discovery: false,
				pool: true,
				buffer: 50,
				max: 1000,
				timeout: 20,
				timeoutError: 1000
			},
			table: 'session',
			sessionTimeout: 86400000,
			flushInterval: 60000,
			debug: false
		});

		app.use(session({
			store: rdbStore,
			secret: dashboard.sessionSecret,
			resave: false,
			cookie: { maxAge: 860000 },
			saveUninitialized: false
		}));

		// Initializes passport and session.
		app.use(passport.initialize());
		app.use(passport.session());
		app.use(helmet());

		// body-parser reads incoming JSON or FORM data and simplifies their
		// use in code.
		// app.use(bodyParser.json());
		app.use(compression());
		app.use(cookie());
		app.use(bodyParser.urlencoded({ extended: true }));

		// The domain name used in various endpoints to link between pages.
		app.locals.domain = dashboard.domainName;

		// The EJS templating engine gives us more power
		app.engine('html', require('ejs').renderFile);
		app.set('view engine', 'html');

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

		/*
		 	This function simplifies the rendering of the page, since every page must be rendered
		 	with the passing of these 4 variables, and from a base path.
			Objectassign(object, newobject) simply merges 2 objects together, in case you didn't know!
		*/
		const renderTemplate = (res, req, template, data = {}) => {
			const baseData = {
				bot: client,
				path: req.path,
				auth: !!req.isAuthenticated(),
				user: req.isAuthenticated() ? req.user : null
			};
			res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data));
		};

		// Index page. If the user is authenticated, it shows their info
		// at the top right of the screen.
		app.get('/', (req, res) => {
			client.stats.increment('express.request');
			renderTemplate(res, req, 'index.ejs');
		});

		// The login page saves the page the person was on in the session,
		// then throws the user to the Discord OAuth2 login page.
		app.get('/login', (req, res, next) => {
			client.stats.increment('express.request');
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
			client.stats.increment('express.request');
			if (req.user.id === client.config.ownerID) {
				req.session.isAdmin = true;
			} else {
				req.session.isAdmin = false;
			}
			if (req.session.backURL) {
				const backUrl = req.session.backURL;
				req.session.backURL = null;
				res.redirect(backUrl);
			} else {
				res.redirect('/');
			}
		});

		app.get('/autherror', (req, res) => {
			client.stats.increment('express.request');
			renderTemplate(res, req, 'autherror.ejs');
		});

		app.get('/logout', (req, res) => {
			client.stats.increment('express.request');
			req.session.destroy(() => {
				req.logout();
				res.redirect('/');
				// Inside a callback… bulletproof!
			});
		});

		// The Admin dashboard is similar to the one above, with the exception that
		// it shows all current guilds the bot is on, not *just* the ones the user has
		// access to. Obviously, this is reserved to the bot's owner for security reasons.
		app.get('/admin', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			if (!req.session.isAdmin) return res.redirect('/');
			renderTemplate(res, req, 'admin.ejs');
		});

		app.get('/dashboard', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			const perms = Discord.Permissions;
			renderTemplate(res, req, 'dashboard.ejs', { perms });
		});

		// Simple redirect to the "Settings" page (aka "manage")
		app.get('/dashboard/:guildID', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			res.redirect(`/dashboard/${req.params.guildID}/manage`);
		});

		app.get('/dashboard/:guildID/members', checkAuth, async (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			renderTemplate(res, req, 'guild/members.ejs', {
				guild: guild,
				members: guild.members.array()
			});
		});

		app.get('/dashboard/:guildID/members/list', checkAuth, async (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			if (req.query.fetch) {
				await guild.fetchMembers();
			}
			const totals = guild.members.size;
			const start = parseInt(req.query.start, 10) || 0;
			const limit = parseInt(req.query.limit, 10) || 50;
			let { members } = guild;

			if (req.query.filter && req.query.filter !== 'null') {
				// if (!req.query.filtervalue) return res.status(400);
				members = members.filter(meme => {
					meme = req.query.filterUser ? meme.user : meme;
					return meme.displayName.toLowerCase().includes(req.query.filter.toLowerCase());
				});
			}

			if (req.query.sortby) {
				members = members.sort((a, b) => a[req.query.sortby] > b[req.query.sortby]);
			}
			const memberArray = members.array().slice(start, start + limit);

			const returnObject = [];
			for (let i = 0; i < memberArray.length; i++) {
				const meme = memberArray[i];
				returnObject.push({
					id: meme.id,
					status: meme.user.presence.status,
					bot: meme.user.bot,
					username: meme.user.username,
					displayName: meme.displayName,
					tag: meme.user.tag,
					discriminator: meme.user.discriminator,
					joinedAt: meme.joinedTimestamp,
					createdAt: meme.user.createdTimestamp,
					highestRole: { hexColor: meme.highestRole.hexColor },
					memberFor: moment.duration(Date.now() - meme.joinedAt).format(' D [days], H [hrs], m [mins], s [secs]'),
					roles: meme.roles.map(rollingDownTheHill => ({
						name: rollingDownTheHill.name,
						id: rollingDownTheHill.id,
						hexColor: rollingDownTheHill.hexColor
					}))
				});
			}
			res.json({
				total: totals,
				page: (start / limit) + 1,
				pageof: Math.ceil(members.size / limit),
				members: returnObject
			});
		});

		app.get('/dashboard/:guildID/manage', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (!isManaged && !req.session.isAdmin) res.redirect('/');
			renderTemplate(res, req, 'guild/manage.ejs', { guild });
		});

		app.post('/dashboard/:guildID/manage', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (!isManaged && !req.session.isAdmin) res.redirect('/');
			client.settings.guilds.updateMany(guild.id, req.body);
			res.redirect(`/dashboard/${req.params.guildID}/manage`);
		});

		app.get('/dashboard/:guildID/leave', checkAuth, async (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (!isManaged && !req.session.isAdmin) res.redirect('/');
			await guild.leave();
			if (req.user.id === client.config.ownerID) {
				return res.redirect('/admin');
			}
			res.redirect('/dashboard');
		});

		app.get('/dashboard/:guildID/reset', checkAuth, async (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (!isManaged && !req.session.isAdmin) res.redirect('/');
			// client.settings.set(guild.id, client.settings.get('default'));
			res.redirect(`/dashboard/${req.params.guildID}`);
		});

		app.get('/dashboard/:guildID/stats', checkAuth, (req, res) => {
			client.stats.increment('express.request');
			const guild = client.guilds.get(req.params.guildID);
			if (!guild) return res.status(404);
			const isManaged = guild && !!guild.member(req.user.id) ? guild.member(req.user.id).permissions.has('MANAGE_GUILD') : false;
			if (!isManaged && !req.session.isAdmin) res.redirect('/');
			renderTemplate(res, req, 'guild/stats.ejs', { guild });
		});


		app.get('/commands', (req, res) => {
			client.stats.increment('express.request');
			renderTemplate(res, req, 'commands.ejs', { md });
		});

		// Bot statistics. Notice that most of the rendering of data is done through this code,
		// not in the template, to simplify the page code. Most of it **could** be done on the page.
		app.get('/stats', (req, res) => {
			client.stats.increment('express.request');
			res.redirect('https://p.datadoghq.com/sb/82a5d5fef-1a21d0b3a5');
		});

		app.listen(dashboard.port, () => {
			client.emit('log', `Loaded dashboard on port ${dashboard.port}.`);
		});
	}

}
module.exports = Dashboard;
