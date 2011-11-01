// Load modules
var http = require('http');

// Define base URL of LQFB backend
var baseurl = {
	host: 'apitest.liquidfeedback.org',
	port: 25520
};

var queryLQFB = function(path, handler) {
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

queryLQFB('/info', function(res) {
	console.log('Core Version: ' + res.core_version);
	console.log('API Version:  ' + res.api_version);
});
