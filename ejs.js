#!/usr/bin/node

var ejs = require('ejs')
  , fs = require('fs')
  , tpls = new Array() // Cache for templates
  , fallback_context; // Fallback context

var texts;

fs.readFile(__dirname + '/texts.json', function(err, data) {
	if(err) {
		throw err;
	}

	texts = JSON.parse(data);
	console.log('Finished parsing texts');
} );

//
// READ CONTEXT
//
fs.readFile(__dirname + '/context.json', 'utf8', function(err, data) {
	if(err) {
		state.fail(err);
	}
	fallback_context = JSON.parse(data);
	console.log('Finished parsing fallback context');
} );

//
// Get a list of templates and cache them.
//
fs.readdir(__dirname + '/templates/', function(err, files) {
	if (err) {
		throw err;
	}
	console.log('Found ' + files.length + ' template files:');
	for (f in files) {
		try {
			caching('/templates/' + files[f]);
			console.log(' -- ' + files[f]);
		} catch (ignore) {}
	}
} );

/**
 * @todo requires an additional context variable
 */
exports.render = function(state, template) {
	var headtpl = '/templates/head.tpl';
	var maintpl = '/templates' + template;
	var footertpl = '/templates/footer.tpl';

	/**
	* Render the templates once all data and
	* files are available.
	*/
	var render = function() {
		if(tpls[headtpl] && tpls[maintpl] && tpls[footertpl]) {
			var context = state.context;
			for(key in fallback_context) {
				if( ! (key in context) ) {
					context[key] = fallback_context[key];
					console.log("Fell back for " + key);
				}
			}

			context.texts = texts;

			var head = ejs.render(tpls[headtpl], context);
			var main = ejs.render(tpls[maintpl], context);
			var footer = ejs.render(tpls[footertpl], context);

			var result = state.result;
			result.write(head);
			result.write(main);
			result.write(footer);
			result.end();

			console.log('Served ' + state.request.url);
		} else {
			state.fail(err);
		}
	}

	render();
}

/**
 * Read a template and store it in the cache.
 * @param tpl The path to the template (without __dirname), starting with '/'.
 */
function caching(tpl) {
	if (tpls[tpl] === undefined) {
		fs.readFile(__dirname + tpl, 'utf8', function(err, data) {
			if (err) {
				throw err;
			}
			tpls[tpl] = data;
		} );
	}
};
