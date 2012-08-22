#!/usr/bin/env node

/** @file
 * The Bombay Crushed server.
 *
 * Provides an HTTP server listening on the devices configured in
 * `config.json` or `config.default.json` that serves the Bombay
 * Crushed UI.
 *
 * This server can also serve the static parts of the interface.
 *
 * @todo Add an option to prefix static parts to a different URL
 * allowing to serve them using a traditional webserver.
 */

var http = require('http');
var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var querystring = require('querystring');
var fs = require('fs');
var Canvas = require('canvas');

// load configuration
var config = require('./config.js');

// load modules for building different parts of the ui
var overview = require('./overview.js');
var user = require('./user.js');
var inis = require('./inis.js');
var topics = require('./topics.js');
var area = require('./area.js');
var contacts = require('./contacts.js');
var initiative = require('./initiative.js');
var suggestion = require('./suggestion.js');
var issue = require('./issue.js');

/**
 * Takes care of retrieving data for and rendering the
 * Topics page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showTopics = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "topics";
		if(ctx.units !== undefined) {
			ejs.render(state, '/topics.tpl');
		}
	}

	topics.get(state, finish);
}

/**
 * Takes care of retrieving data for and rendering the
 * user profile page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showProfile = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "profile";
		if(ctx.user !== undefined && ctx.user.units.length != 0) {
			ejs.render(state, '/profile.tpl');
		}
	}

	user.get(state, finish, true);
}

/**
 * Takes care of retrieving data for and rendering the
 * area page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showArea = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	// we need an area id
	if(!state.url.query.area_id) {
		console.log('Please provide area_id parameter');
		invalidURL(state);
		return;
	}

	// get page numbers
	var page = 1;
	var memberpage = 1;
	if(state.url.query.page) {
		page = state.url.query.page;
	}
	if(state.url.query.memberpage) {
		memberpage = state.url.query.memberpage;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "area";
		if(ctx.area !== undefined) {
			ejs.render(state, '/area.tpl');
		}
	}

	area.show(state, finish, page, memberpage);
}

/**
 * Takes care of retrieving data for and rendering the
 * initiative page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showInitiative = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	// we need an initiative id
	if(!state.url.query.initiative_id) {
		console.log('Please provide initiative_id parameter');
		invalidURL(state);
		return;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "initiative";
		if(ctx.initiative !== undefined) {
			ejs.render(state, '/initiative.tpl');
		}
	}

	initiative.show(state, finish);
}

//TODO remove
/**
 * Takes care of retrieving data for and rendering the
 * issue page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showIssue = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "issue";
	ejs.render(state, '/issue.tpl');
}

/**
 * Takes care of retrieving data for and rendering the
 * timeline page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showTimeline = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "timeline";
		if(ctx.inis !== undefined) {
			ejs.render(state, '/timeline.tpl');
		}
	}

	inis(state, finish);
}

/**
 * Sends a 404 error page to the browser
 *
 * @state The state object representing the current HTTP-Request
 */
var invalidURL = function(state, logmessage, errorcode) {
	if(!logmessage) {
		logmessage = 'Invalid resource requested';
	}
	if(!errorcode) {
		errorcode = 404;
	}

	console.log('WARN: ' + logmessage + ' – Sent code ' + errorcode + ' to the client');

	var res = state.result;
	res.writeHead(errorcode, {'Content-Type': 'text/plain'});
	res.end('Kuckst du woanders!\n');
}

/**
 * Sends a 5XX error page to the browser.
 *
 * @state The state object representing the current HTTP-Request
 */
var serverError = function(state, logmessage, errorcode) {
	if(!errorcode) {
		errorcode = 500;
	}

	console.error('ERROR: ' + logmessage + ' – Sent code ' + errorcode + ' to the client');
	console.trace();

	var res = state.result;
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end('I feel blue. Guess I\'ll go swimming!\n');
}

/**
 * Create a new session with the lfapi server for the current user or
 * send user back to login page.
 *
 * @param state State object for the current HTTP-Request
 */
var performLogin = function(state) {
	// get form data
	if(state.request.method !== 'POST') {
		state.sendToLogin();
		return;
	}

	// collect data
	body = '';

	state.request.on('data', function(chunk) {
		body += chunk;
	});

	state.request.on('end', function() {
		data = querystring.parse(body);
		lf.perform('/session', { key: data.key }, state, function(res) {
			state.session_key(res.session_key);

			lf.query('/info', {}, state, function(res) {
				state.user_id(res.current_member_id);
				state.context.meta.do_refresh = true;
				state.context.meta.refresh_url = data['refresh-url'] || (state.app_prefix + '/overview');
				ejs.render(state, '/loggedIn.tpl');
			});
		});
	});
}

/**
 * Kill all session info and send the user back to the overview page.
 *
 * @param state State object for the current HTTP-Request
 */
var performLogout = function(state) {
	// *nom* *nom*
	state.session_key(null);
	state.user_id(null);
	// and run
	state.context.meta.do_refresh = true;
	state.context.meta.refresh_url = state.app_prefix + '/overview';
	ejs.render(state, '/loggedOut.tpl');
}

/**
 * Server a static file from the filesystem to the browser.
 *
 * @param state State object for the current HTTP-Request
 */
var serveStatic = function(state) {
	// TODO guess content type

	// stream from file to requestee
	// TODO could probably be read chunkwise
	filepath = __dirname + '/html' + state.local_path;
	console.log('Serving: ' + filepath);
	fs.readFile(filepath, function(err, data) {
		if(err) {
			invalidURL(state);
			return;
		}
		state.result.end(data);
		console.log('Served: ' + filepath);
	});
}

/**
 * Serve a user picture from LQFB to the browser.
 *
 * The id of the user who's picture is to be server is taken
 * from the HTTP request url.
 *
 * @param state State object for the current HTTP-Request
 */
var sendPicture = function(state) {
	var user_id = state.local_path.slice('/picbig/'.length);
	console.log('Retrieving portrait for user ' + user_id);
	var query_obj = {
		'type': 'photo',
		'member_id': user_id
	}
	lf.query('/member_image', query_obj, state, function(result) {
		var response = state.result;
		if(result.status === 'ok' && result.result.length) {
			var image = result.result[0];
			response.setHeader("Content-Type", image.content_type);
			buf = new Buffer(image.data, 'base64');
			response.write(buf);
			response.end();
		} else {
			// send placeholder pic
			filepath = __dirname + '/html/img/placeholder.png';
			fs.readFile(filepath, function(err, data) {
				if(err) {
					state.fail('Failed to get placeholder user image: ' + err);
					return;
				}
				state.result.end(data);
			});
		}
	});
}

/**
 * Serve a user avatar from LQFB to the browser.
 *
 * The id of the user who's avatar is to be server is taken
 * from the HTTP request url.
 *
 * @param state State object for the current HTTP-Request
 */
var sendAvatar = function(state) {
	var user_id = state.local_path.slice('/avatar/'.length);
	console.log('Retrieving avatar for user ' + user_id);
	var query_obj = {
		'type': 'avatar',
		'member_id': user_id
	}
	lf.query('/member_image', query_obj, state, function(result) {
		var response = state.result;
		if(result.status === 'ok' && result.result.length) {
			var image = result.result[0];
			response.setHeader("Content-Type", image.content_type);
			buf = new Buffer(image.data, 'base64');
			response.write(buf);
			response.end();
		} else {
			// send placeholder pic
			filepath = __dirname + '/html/img/no_profilepic.png';
			fs.readFile(filepath, function(err, data) {
				if(err) {
					state.fail('Failed to get placeholder user avatar: ' + err);
					return;
				}
				state.result.end(data);
			});
		}
	});
}

var sendSmallPicture = function(state) {
	var Image = Canvas.Image;
	var img = new Image;
	img.onerror = function(err) {
		throw err;
	};
	img.onload = function() {
		var max = Math.max(img.width, img.height)
		 , width = img.width * 24 / max
		 , height = img.height * 24 / max
		 , canvas = new Canvas(width, height)
		 , ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, width, height);
		canvas.toBuffer(function(err, buf) {
			var response = state.result;
			response.write(buf);
			response.end();
		});
	};
	var user_id = state.local_path.slice('/picmini/'.length);
	console.log('Retrieving smallpic for user ' + user_id);
	var query_obj = {
		'type': 'avatar',
		'member_id': user_id
	};
	lf.query('/member_image', query_obj, state, function(result) {
		if (result.status === 'ok' && result.result.length) {
			var image = result.result[0];
			state.result.setHeader("Content-Type", image.content_type);
			img.src = new Buffer(image.data, 'base64');
		} else {
			// send placeholder pic
			filepath = __dirname + '/html/img/no_profilepic24.png';
			fs.readFile(filepath, function(err, data) {
				if(err) {
					state.fail('Failed to get placeholder user avatar: ' + err);
					return;
				}
				state.result.end(data);
			});
		}
	});
}

/**
 * Mapping from URLs to functions
 *
 * For a detailed German explanation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
var url_mapping = {
	'/': overview.show,
	'/index.html': overview.show,
	'/overview': overview.show,
	'/login': performLogin,
	'/logout': performLogout,
	'/topics': showTopics,
	'/profile': showProfile,
	'/contacts': contacts.show,
	'/timeline': showTimeline,
	'/update_inis': overview.updateInis,
	'/update_news': overview.updateNews,
	'/favicon.ico': serveStatic,
	'/initiative': initiative.show,
	'/area': showArea,
	'/issue': issue.show,//TODO delete showIssue,
	'/suggestion': suggestion.show,
	'/update_opinions': suggestion.updateOpinions,
	'/update_areas_table': topics.update_areas_table
}

/**
 * Mapping from patterns to functions
 *
 * For a detailed German explanation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
var pattern_mapping = [
	{ pattern: '/picbig/', mapped: sendPicture },
	{ pattern: '/avatar/', mapped: sendAvatar },
	{ pattern: '/picmini/', mapped: sendSmallPicture },
	{ pattern: '/css/', mapped: serveStatic },
	{ pattern: '/js/', mapped: serveStatic },
	{ pattern: '/img/', mapped: serveStatic },
	{ pattern: '/content_img/', mapped: serveStatic },
	{ pattern: /^\/\w+\.html/, mapped: serveStatic }
];

/**
 * Function to Map URLs to functions
 *
 * For a detailed German explanation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
mapU2F = function(state, url_mappings, pattern_mappings) {
	// Forward decleration of variables as recommended by Crockford
	var i;
	var mapped;

	if(config.listen.baseurl) {
		if(state.url.pathname.substring(0, state.app_prefix.length) != state.app_prefix) {
			// this url is outside our app
			console.log(state.url.pathname + ' does not start with ' + state.app_prefix);
			invalidURL(state);
			return;
		}
	}
	var path = state.local_path;

	console.log('Request url: ' + path + ' (APP Path is ' + state.app_prefix + ')');

	// check whether the url has a direct mapping
	mapped = url_mappings[path];
	if (mapped) {
		mapped(state);
	} else {
		// url did not match any of the direct mappingss
		// check whether it matches anny of the patterns
		for (i = 0; !mapped && i < pattern_mappings.length; i = i + 1) {
			pattern = pattern_mappings[i].pattern;
			//console.log('Testing pattern ' + i + ': ' + pattern + ' [' + typeof(pattern) + ']');
			if( typeof(pattern) === 'string' && path.slice(0, pattern.length) === pattern ) {
				mapped = pattern_mappings[i].mapped;
			} else if ( pattern.test && typeof(pattern.test) === 'function' && pattern.test(path) ) {
				// we can only assume it's a regexp, as typeof is not clear on it,
				// but if it has a test function...
				mapped = pattern_mappings[i].mapped;
			}
		}
		if (mapped) {
			mapped(state);
		} else {
			console.log(path + ' has not been mapped');
			invalidURL(state);
		}
	}
}

// get the state object creation function
var State = require('./state.js')(serverError, invalidURL);

/**
 * the main-function of the server
 */
server = function() {
	// make sure uncaught exceptions don't kill the server
	process.on('uncaughtException', function (err) {
		if(err.stack) {
			err = err.stack;
		}
		console.error('ERROR: Exception not handled properly: ' + err);
	});

	// check connection to API server
	lf.query('/info', {}, null, function(res) {
		server = lf.getBaseURL();
		console.log('Connected to ' + server.host + ':' + server.port);
		console.log('Core Version: ' + res.core_version);
		console.log('API Version:  ' + res.api_version);
	});

	// create the HTTP-Server
	var server = http.createServer(function (req, res) {
		// create the state object for this request
		var state = State.create(req, res);
		// have the proper handler invoked for the url of this request
		mapU2F(state, url_mapping, pattern_mapping);
	});
	if(config.listen.host) {
		server.listen(config.listen.port, config.listen.host);
		console.log('Server running at port ' + config.listen.port + ' on ' + config.listen.host);
	} else {
		server.listen(config.listen.port);
		console.log('Server running at port ' + config.listen.port + ' on all interfaces');
	}
	console.log('Server Base URL: ' + config.listen.baseurl);
};

// invoke main function
server();
