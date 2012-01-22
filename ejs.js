#!/usr/bin/node

var ejs = require('ejs')
  , fs = require('fs')
  , context
  , headtpl
  , maintpl
  , footertpl;

/**
 * Render the templates once all data and
 * files are available.
 */
var render = function() {
	if(context && headtpl && maintpl && footertpl) {
		var head = ejs.render(headtpl, context);
		var main = ejs.render(maintpl, context);
		var footer = ejs.render(footertpl, context);

		console.log(head);
		console.log(main);
		console.log(footer);
	}
}

//
// READ CONTEXT
//
fs.readFile(__dirname + '/context.json', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	context = JSON.parse(data);

	render();
} );

//
// READ TEMPLATES
//
fs.readFile(__dirname + '/templates/head.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	headtpl = data;

	render();
} );

fs.readFile(__dirname + '/templates/main.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	maintpl = data;

	render();
} );

fs.readFile(__dirname + '/templates/footer.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	footertpl = data;

	render();
} );