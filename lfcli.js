/** @file
 * This module provides several utilities to easier access
 * access the lfapi.
 *
 * This is meant to be used as a module in nodejs, so use
 * @code
 * var lfcli = require('lfcli.js')
 * @endcode
 */

var http = require('http');

/// Define base URL of LQFB backend
// TODO pass this in from outside
var baseurl = {
	host: 'apitest.liquidfeedback.org',
	port: 25520
};

/**
 * Build up the request options for the given path.
 */
var buildRequestOptions = function(path) {
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
	return options;
}

/**
 * Perform a query against the Liquid Feedback API Server.
 *
 * The function will automaticall check for HTTP-Errors, parse the JSON returned by the server and
 * invoke the given handler function.
 *
 * @param path The query to perform as defined in http://dev.liquidfeedback.org/trac/lf/wiki/API.
 * @param handler The function to handle the JSON object returned by the API Server in response to the query.
 * @return The ClientResponseObject given by http(s).request.
 */
exports.query = function(path, handler) {
	var options = buildRequestOptions(path);

	var extended_handler = function(res) {
		if(res.statusCode != 200) {
			console.error('Request failed: ' + res.statusCode);
			return;
		}

		// aggregate result body
		body = '';
		res.on('data', function(chunck) {
			body += chunck;
		});

		// when everything is aggregated, part body and invoke handlers
		res.on('end', function() {
			// TODO handle parsing errors
			answer = JSON.parse(body);
			if(!answer.status || answer.status !== 'ok') {
				console.warn('STATUS:' + answer.status);
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
 * Allow to update the Base URL.
 *
 * @param newbase JSON specification of the base URL as it would be expected by http(s).request().
 */
exports.setBaseURL = function(newbase) {
	baseurl = newbase;
}
