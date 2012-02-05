#!/usr/bin/env node

var ejs = require('./ejs.js');

var resultWriter = {
	'write': function(data) {
		console.log(data);
	},
	
	'end': function() { /* noop */ }
}

var template = 'main.tpl';

if(process.argv.length > 2) {
	template = process.argv[2];
}

ejs.render({'result': resultWriter, 'fail': function(message, code) { console.error(message + ' – Error code: ' + code)} },
           '/' + template
);
