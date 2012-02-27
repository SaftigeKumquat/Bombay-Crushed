#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var Cookies = require('cookies');
var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var querystring = require('querystring');

// Ok, not really an index, but works.
var printIndex = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	lf.query('/member', {'member_id': state.user_id()}, function(res) {
		lf_user = res.result[0];
		state.context.user = {
			'nick': lf_user.name,
			'picbig': '/picbig/' + lf_user.id
		};
		ejs.render(state, '/main.tpl');
	} );
}

var showProfile = function(state) {
	ejs.render(state, '/profile.tpl');
}

var showContacts = function(state) {
	ejs.render(state, '/contacts.tpl');
}

var invalidURL = function(state) {
	var res = state.result;
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Kuckst du woanders!\n');
}

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
		lf.perform('/session', { key: data.key }, function(res) {
			state.session_key(res.session_key);

			lf.query('/info', { session_key: state.session_key() }, function(res) {
				state.user_id(res.current_member_id);
				printIndex(state);
			});
		});
	});
}

var performLogout = function(state) {
	// *nom* *nom*
	state.session_key(null);
	state.user_id(null);
	// and run
	printIndex(state);
}

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

var sendPicture = function(state) {
	var user_id = state.request.url.slice('/picbig/'.length);
	console.log('Retrieving portrait for user ' + user_id);
	var query_obj = {
		'type': 'portrait',
		'member_id': user_id
	}
	if(state.session_key()) {
		query_obj.session_key = state.session_key()
	};
	lf.query('/member_image', query_obj, function(result) {
		var response = state.result;
		if(result.result.length) {
			var image = result.result[0];
			response.setHeader("Content-Type", result.content_type);
			response.end(result.data);
		} else {
			state.fail('No image found for user ' + user_id, 404);
		}
	});
}

/**
 * Mapping from URLs to functions
 */
var url_mapping = {
	'/': printIndex,
	'/index.html': printIndex,
	'/login': performLogin,
	'/logout': performLogout,
	'/profile.html': showProfile,
	'/contacts.html': showContacts
}

/**
 * Mapping from patterns to functions
 */
var pattern_mapping = [
	{ pattern: '/picbig', mapped: sendPicture },
	{ pattern: '/css/', mapped: serveStatic },
	{ pattern: '/js/', mapped: serveStatic },
	{ pattern: '/img/', mapped: serveStatic },
	{ pattern: '/content_img/', mapped: serveStatic },
	{ pattern: /^\/\w+\.html/, mapped: serveStatic }
];

/**
 * Function to Map URLs to functions
 */
mapU2F = function(state, url_mappings, pattern_mappings) {
	// Forward decleration of variables as recommended by Crockford
	var i;
	var mapped;

	var req = state.request;

	console.log('Request url: ' + req.url);

	// check whether the url has a direct mapping
	mapped = url_mappings[req.url];
	if (mapped) {
		mapped(state);
	} else {
		// url did not match any of the direct mappingss
		// check whether it matches anny of the patterns
		for (i = 0; !mapped && i < pattern_mappings.length; i = i + 1) {
			pattern = pattern_mappings[i].pattern;
			//console.log('Testing pattern ' + i + ': ' + pattern + ' [' + typeof(pattern) + ']');
			if( typeof(pattern) === 'string' && req.url.slice(0, pattern.length) === pattern ) {
				mapped = pattern_mappings[i].mapped;
			} else if ( pattern.test && typeof(pattern.test) === 'function' && pattern.test(req.url) ) {
				// we can only assume it's a regexp, as typeof is not clear on it,
				// but if it has a test function...
				mapped = pattern_mappings[i].mapped;
			}
		}
		if (mapped) {
			mapped(state);
		} else {
			console.log(req.url + ' has not been mapped');
			invalidURL(state);
		}
	}
}

/**
 * Create an object that keeps the state during a full request / response
 * cycle. This state will not be kept between request. It's purpose is to
 * bundle all data collected while building the response to one request.
 */
var createState = function(req, res) {
	var state = {
		'request': req,
		'result': res,
		'fail': function(logmessage, errorcode) {
			serverError(state, logmessage, errorcode);
		},
		'cookies': new Cookies(req, res),
		'sendToLogin': function(message) {
			// TODO pass message to template
			ejs.render(state, '/login.tpl');
		},
		'context': {}
	};

	var session_key, user_id;

	// convenience..
	state.session_key = function(key) {
		if(key === undefined) {
			if(session_key === undefined) {
				session_key = state.cookies.get('session_key');
			}
			return session_key;
		} else {
			session_key = key;
			state.cookies.set('session_key', session_key);
			return session_key;
		}
	}
	state.user_id = function(id) {
		if(id === undefined) {
			if(user_id === undefined) {
				user_id = state.cookies.get('user_id');
			}
			return user_id;
		} else {
			user_id = id;
			state.cookies.set('user_id', user_id);
			return user_id;
		}
	}

	return state;
}

server = function() {
	// make sure uncaught exceptions don't kill the server
	process.on('uncaughtException', function (err) {
		if(err.stack) {
			err = err.stack;
		}
		console.error('ERROR: Exception not handled properly: ' + err);
	});

	lf.query('/info', {}, function(res) {
		server = lf.getBaseURL();
		console.log('Connected to ' + server.host + ':' + server.port);
		console.log('Core Version: ' + res.core_version);
		console.log('API Version:  ' + res.api_version);
	});

	http.createServer(function (req, res) {
		var state = createState(req, res);
		mapU2F(state, url_mapping, pattern_mapping);
	}).listen(1337, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:1337/');

};

server();
