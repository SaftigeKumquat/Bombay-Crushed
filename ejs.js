#!/usr/bin/node

var ejs = require('ejs')
  , fs = require('fs')
  , context
  , headtpl
  , maintpl
  , footertpl;
exports.tpls = new Array(); // Cache for templates
exports.fbctx = undefined; // Fallback context

var texts;

fs.readFile(__dirname + '/texts.json', function(err, data) {
	if(err) {
		throw err;
	}

	texts = JSON.parse(data);
	console.log('Finished parsing texts');
} );

/**
 * @todo requires an additional context variable
 */
exports.render = function(state, template) {
	var fallback_context, headtpl, maintpl, footertpl;

	/**
	* Render the templates once all data and
	* files are available.
	*/
	var render = function() {
		if(fallback_context && headtpl && maintpl && footertpl) {
			context = state.context;
			for(key in fallback_context) {
				if( ! (key in context) ) {
					context[key] = fallback_context[key];
					console.log("Fell back for " + key);
				}
			}

			context.texts = texts;

			var head = ejs.render(headtpl, context);
			var main = ejs.render(maintpl, context);
			var footer = ejs.render(footertpl, context);

			var result = state.result;
			result.write(head);
			result.write(main);
			result.write(footer);
			result.end();

			console.log('Served ' + state.request.url);
		}
	}

	//
	// READ CONTEXT
	//
	if (exports.fbctx === undefined) {
		fs.readFile(__dirname + '/context.json', 'utf8', function(err, data) {
			if(err) {
				state.fail(err);
			}

			fallback_context = JSON.parse(data);
			exports.fbctx = fallback_context;

			render();
		} );
	} else {
		fallback_context = exports.fbctx;
	}

	//
	// READ TEMPLATES
	//
	if (exports.tpls['/templates/head.tpl'] === undefined) {
		fs.readFile(__dirname + '/templates/head.tpl', 'utf8', function(err, data) {
			if(err) {
				state.fail(err);
			}

			headtpl = data;
			exports.tpls['/templates/head.tpl'] = data;

			render();
		} );
	} else {
		headtpl = exports.tpls['/templates/head.tpl'];
	}

	if (exports.tpls['/templates' + template] === undefined) {
		fs.readFile(__dirname + '/templates' + template, 'utf8', function(err, data) {
			if(err) {
				state.fail(err);
			}

			maintpl = data;
			exports.tpls['/templates' + template] = data;

			render();
		} );
	} else {
		maintpl = exports.tpls['/templates' + template];
	}

	if (exports.tpls['/templates/footer.tpl'] === undefined) {
		fs.readFile(__dirname + '/templates/footer.tpl', 'utf8', function(err, data) {
			if(err) {
				state.fail(err);
			}

			footertpl = data;
			exports.tpls['/templates/footer.tpl'] = data;

			render();
		} );
	} else {
		footertpl = exports.tpls['/templates/footer.tpl'];
	}
	render();
}
