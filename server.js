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

// load configuration
var config = require('./config.js');

// load modules for building different parts of the ui
var overview = require('./overview.js');
var user = require('./user.js');
var inis = require('./inis.js');
var topics = require('./topics.js');

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

	user.get(state, finish);
}

/**
 * Takes care of retrieving data for and rendering the
 * user contacts page.
 *
 * @param state The state object of the current HTTP-Request
 */
var showContacts = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "contacts";
	ejs.render(state, '/contacts.tpl');
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
var invalidURL = function(state) {
	var res = state.result;
	res.writeHead(404, {'Content-Type': 'text/plain'});
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
				overview.show(state);
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
	overview.show(state);
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
	filepath = __dirname + '/html' + state.request.url;
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
	var user_id = state.request.url.slice('/picbig/'.length);
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
			state.fail('No image found for user ' + user_id, 404);
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
	var user_id = state.request.url.slice('/avatar/'.length);
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
			state.fail('No avatar found for user ' + user_id, 404);
		}
	});
}

/**
 * Mapping from URLs to functions
 *
 * For a detailed German explenation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
var url_mapping = {
	'/': overview.show,
	'/index.html': overview.show,
	'/overview': overview.show,
	'/login': performLogin,
	'/logout': performLogout,
	'/topics': showTopics,
	'/profile': showProfile,
	'/contacts': showContacts,
	'/timeline': showTimeline,
	'/favicon.ico': serveStatic
}

/**
 * Mapping from patterns to functions
 *
 * For a detailed German explenation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
var pattern_mapping = [
	{ pattern: '/picbig/', mapped: sendPicture },
	{ pattern: '/avatar/', mapped: sendAvatar },
	{ pattern: '/css/', mapped: serveStatic },
	{ pattern: '/js/', mapped: serveStatic },
	{ pattern: '/img/', mapped: serveStatic },
	{ pattern: '/content_img/', mapped: serveStatic },
	{ pattern: /^\/\w+\.html/, mapped: serveStatic }
];

/**
 * Function to Map URLs to functions
 *
 * For a detailed German explenation check http://www.marix.org/content/wie-man-nodejs-urls-auf-funktionen-abbildet
 */
mapU2F = function(state, url_mappings, pattern_mappings) {
	// Forward decleration of variables as recommended by Crockford
	var i;
	var mapped;

	var path = state.url.pathname;

	console.log('Request url: ' + path);

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
var State = require('./state.js')(serverError);

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

};

// invoke main function
server();
