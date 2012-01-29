#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var ejs = require('./ejs.js');

// Ok, not really an index, but works.
var printIndex = function(state) {
	ejs.render(state, '/main.tpl');
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
 * Mapping from URLs to functions
 */
var url_mapping = {
  '/': printIndex,
  '/index.html': printIndex
}
/**
 * Mapping from patterns to functions
 */
var pattern_mapping = [
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
		}
	};
	return state;
}

server = function() {
	http.createServer(function (req, res) {
		var state = createState(req, res);
		mapU2F(state, url_mapping, pattern_mapping);
	}).listen(1337, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:1337/');

	// make sure uncaught exceptions don't kill the server
	process.on('uncaughtException', function (err) {
		if(err.stack) {
			err = err.stack;
		}
		console.error('ERROR: Exception not handled properly: ' + err);
	});
};

server();