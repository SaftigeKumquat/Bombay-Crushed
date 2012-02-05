#!/usr/bin/env node

var ejs = require('./ejs.js');

var resultWriter = {
	'write': function(data) {
		console.log(data);
	},
	
	'end': function() { /* noop */ }
}

ejs.render({'result': resultWriter, 'fail': function(message, code) { console.error(message + ' – Error code: ' + code)} },
           '/main.tpl'
);
