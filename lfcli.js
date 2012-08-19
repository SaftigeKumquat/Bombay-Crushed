/** @file
 * This module provides several utilities to easier access
 * the lfapi.
 *
 * This is meant to be used as a module in nodejs, so use
 * @code
 * var lfcli = require('lfcli.js')
 * @endcode
 */

var http = require('http');
var querystring = require('querystring');
// load configuration
var config = require('./config.js');

/// Define base URL of LQFB backend
var baseurl = config.baseurl

/**
 * Build up the request options for the given path.
 *
 * @param path The query to perform as defined in http://dev.liquidfeedback.org/trac/lf/wiki/API.
 * @param args A dictionary of query arguments
 * @param state The current HTTP requests state object.
 *              Used for session information
 */
var buildRequestOptions = function(path, args, state) {
	var options = {
		host: baseurl.host,
		port: baseurl.port
	};
	if(path) {
		if(baseurl.path && typeof(baseurl.path) === 'string') {
			// make sure there is a dash in between
			if(path.charAt(0) === '/' || baseurl.path.charAt(baseurl.path.length-1) === '/') {
				options.path = baseurl.path + path;
			} else {
				options.path = baseurl.path + '/' + path;
			}
		} else {
			options.path = path;
		}
	}
	if(args) {
		if(state && state.session_key()) {
			args['session_key'] = state.session_key()
		}
		options.path += '?' + querystring.stringify(args);
	}
	return options;
}

/**
 * Perform a query against the Liquid Feedback API Server.
 *
 * The function will automaticall check for HTTP-Errors, parse the JSON returned by the server and
 * invoke the given handler function.
 *
 * In case of insufficient priviledges this function will trigger a redirection to the login page.
 *
 * @param path The query to perform as defined in http://dev.liquidfeedback.org/trac/lf/wiki/API.
 * @param args Any arguments required to perform the query (JS Object as Key-Value-Map)
 * @param state The current HTTP requests state object. Used for session and error handling.
 * @param handler The function to handle the JSON object returned by the API Server in response to the query.
 * @return The ClientResponseObject given by http(s).request.
 */
exports.query = function(path, args, state, handler) {
	var options = buildRequestOptions(path, args, state);

	var extended_handler = function(res) {
		if(res.statusCode != 200) {
			console.error('Request failed: ' + res.statusCode);
			return;
		}

		// aggregate result body
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});

		// when everything is aggregated, part body and invoke handlers
		res.on('end', function() {
			// TODO handle parsing errors
			var answer = JSON.parse(body);
			if(!answer.status || answer.status !== 'ok') {
				if(answer.status && answer.status === 'forbidden') {
					state.sendToLogin();
				}
				console.warn('STATUS: ' + answer.status + ' - Error String: "' + answer.error + '" - Query was: ' + path + ' ' + JSON.stringify(args));
			}
			// TODO different handler in case of errors
			handler(answer);
		});
	}

	return http.get(options, extended_handler).on('error', function(e) {
		console.error("Got error: " + e.message);
	});
};

/**
 * Perform an action agains the Liquid Feedback API Server.
 *
 * The function will automaticall check for HTTP-Errors, parse the JSON returned by the server and
 * invoke the given handler function.
 *
 * In case of insufficient priviledges this function will trigger a redirection to the login page.
 *
 * @param path The action to perform as defined in http://dev.liquidfeedback.org/trac/lf/wiki/API.
 * @param args Any arguments required to perform the actions (JS Object as Key-Value-Map)
 * @param state The current HTTP requests state object. Used for session and error handling.
 * @param handler The function to handle the JSON object returned by the API Server in response to the query.
 * @return The ClientResponseObject given by http(s).request.
 */
exports.perform = function(path, args, state, handler) {
	var options = buildRequestOptions(path, state);
	options.method = 'POST';

	var extended_handler = function(res) {
		if(res.statusCode != 200) {
			console.error('Request failed: ' + res.statusCode);
			return;
		}

		// aggregate result body
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});

		// when everything is aggregated, part body and invoke handlers
		res.on('end', function() {
			// TODO handle parsing errors
			var answer = JSON.parse(body);
			if(!answer.status || answer.status !== 'ok') {
				if(answer.status && answer.status === 'forbidden') {
					state.sendToLogin();
				}
				console.warn('STATUS: ' + answer.status + ' - Error String: "' + answer.error + '" - Query was: ' + path + ' ' + JSON.stringify(args));
			}
			// TODO different handler in case of errors
			handler(answer);
		});
	}

	var req = http.request(options, extended_handler).on('error', function(e) {
		console.error("Got error: " + e.message);
	});

	req.write(querystring.stringify(args));

	req.end();

	return req;
};


/**
 * Allow to update the Base URL.
 *
 * @param newbase JSON specification of the base URL as it would be expected by http(s).request().
 */
exports.setBaseURL = function(newbase) {
	baseurl = newbase;
}

exports.getBaseURL = function() {
	return {
		'host': baseurl.host,
		'port': baseurl.port
	}
}
