#!/usr/bin/node

/** @file
 * Template rendering logic
 *
 * This file contains the functionality required to render a template from the filesystem
 * into the output stream of an HTTP request. The relevant interface function to be used
 * from the outside is render.
 */

var ejs = require('ejs')
  , fs = require('fs')
  , tpls = new Array() // Cache for templates
  , fallback_context // Fallback context
  , texts
  , logger = require('./logger.js');

fs.readFile(__dirname + '/texts.json', function(err, data) {
	if(err) {
		throw err;
	}

	texts = JSON.parse(data);
	logger(1, 'Finished parsing texts');
} );

//
// READ CONTEXT
//
fs.readFile(__dirname + '/context.json', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}
	fallback_context = JSON.parse(data);
	logger(1, 'Finished parsing fallback context');
} );

//
// Get a list of templates and cache them.
//
fs.readdir(__dirname + '/templates/', function(err, files) {
	var cache_if_not_dir = function(filename) {
		logger(1, 'stating ' + filename);
		fs.stat(__dirname + '/templates/' + filename, function(err, stats) {
			// ignore errors
			if(!err
			   && !stats.isDirectory() // ignore directories
			   && !filename.match(/^\./) // ignore hidden file
			   && !filename.match(/~$/) // ignore typical editor backup files
			  ) {
				try {
					caching('/templates/' + filename);
					logger(1, ' -- ' + filename);
				} catch (ignore) {}
			}
		});
	}

	var f;
	var cache_if_not_dir;

	if (err) {
		throw err;
	}
	logger(1, 'Found ' + files.length + ' template files:');
	for (f in files) {
		cache_if_not_dir(files[f]);
	}
} );

/**
 * Renders the given template.
 *
 * All information in the template will be filled from the
 * given state object. In case of errors the handlers of the
 * state object will be invoked.
 *
 * @param state A state object of the current HTTP Request
 * @param template Name of the template to render
 * @param standAlone to indicate if head and foot should be included 
 *
 * @todo Somewhere document all the values expected on the state
 * object, e.g. state.context.meta.currentpage.
 */
exports.render = function(state, template, standAlone) {
	var headtpl = '/templates/head.tpl';
	var maintpl = '/templates' + template;
	var footertpl = '/templates/footer.tpl';

	/**
	* Render the templates once all data and
	* files are available.
	*/
	if(tpls[headtpl] && tpls[maintpl] && tpls[footertpl]) {
		var context = state.context;
		for(key in fallback_context) {
			if( ! (key in context) ) {
				context[key] = fallback_context[key];
				logger(1, "Fell back for " + key);
			}
		}

		context.texts = texts;

		// check login
		if(!state.session_key()) {
			context.loggedin = false;
		}
		else {
			context.loggedin = true;
		}

		var result = state.result;

		if(!standAlone) {
			result.write(tpls[headtpl](context));
		}

		result.write(tpls[maintpl](context));

		if(!standAlone) {
			result.write(tpls[footertpl](context));
		}

		result.end();

		logger(1, 'Served ' + state.request.url);
	} else {
		state.fail('No template found for the requested page.', 500);
	}
}

/**
 * Read a template and store it in the cache.
 * @param tpl The path to the template (without __dirname), starting with '/'.
 */
function caching(tpl) {
	if (tpls[tpl] === undefined) {
		var full_path = __dirname + tpl;
		fs.readFile(full_path, 'utf8', function(err, data) {
			if (err) {
				throw err;
			}
			logger(1, 'Compiling template ' + full_path);
			tpls[tpl] = ejs.compile(data, {filename: full_path});
		});
	}
}
