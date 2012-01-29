#!/usr/bin/node

var ejs = require('ejs')
  , fs = require('fs')
  , context
  , headtpl
  , maintpl
  , footertpl;

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
	/**
	* Render the templates once all data and
	* files are available.
	*/
	var render = function() {
		if(context && headtpl && maintpl && footertpl) {
			context.texts = texts;

			var head = ejs.render(headtpl, context);
			var main = ejs.render(maintpl, context);
			var footer = ejs.render(footertpl, context);

			var result = state.result;
			result.write(head);
			result.write(main);
			result.write(footer);
			result.end();
		}
	}

	//
	// READ CONTEXT
	//
	fs.readFile(__dirname + '/context.json', 'utf8', function(err, data) {
		if(err) {
			state.fail(err);
		}

		context = JSON.parse(data);

		render();
	} );

	//
	// READ TEMPLATES
	//
	fs.readFile(__dirname + '/templates/head.tpl', 'utf8', function(err, data) {
		if(err) {
			state.fail(err);
		}

		headtpl = data;

		render();
	} );

	fs.readFile(__dirname + '/templates' + template, 'utf8', function(err, data) {
		if(err) {
			state.fail(err);
		}

		maintpl = data;

		render();
	} );

	fs.readFile(__dirname + '/templates/footer.tpl', 'utf8', function(err, data) {
		if(err) {
			state.fail(err);
		}

		footertpl = data;

		render();
	} );
}
