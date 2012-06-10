#!/usr/bin/env node

/** @file
 * A simple CLI test utility for `ejs.js`.
 *
 * By default will render the template `main.js` to stdout.
 * Other template names can be passed as the first program argument.
 */

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
