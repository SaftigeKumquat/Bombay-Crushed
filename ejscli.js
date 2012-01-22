#!/usr/bin/node

var ejs = require('./ejs.js');

var resultWriter = {
	'write': function(data) {
		console.log(data);
	},
	
	'end': function() { /* noop */ }
}

ejs.render('/main.tpl', resultWriter);