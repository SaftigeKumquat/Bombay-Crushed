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
	var options = baseurl;
	options.path = path;

	//console.log(JSON.stringify(options));

	var extended_handler = function(res) {
		if(res.statusCode != 200) {
			console.warn('Request failed!');
			return;
		}

		// aggregate result body
		body = '';
		res.on('data', function(chunck) {
			body += chunck;
		});

		// when everything is aggregated, part body and invoke handlers
		res.on('end', function() {
			answer = JSON.parse(body);
			console.log('STATUS:' + answer.status);
			handler(answer);
		});
	}

	return http.get(options, extended_handler).on('error', function(e) {
		console.log("Got error: " + e.message);
	});
};
