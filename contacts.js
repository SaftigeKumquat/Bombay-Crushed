/** @file
 * Functionality required for building the contacts page
 *
 * Only function to use externally is show, which will trigger
 * data collection for the overview page and finally cause rendering it.
 */

var ejs = require('./ejs.js');

/**
 * Takes care of retrieving data for and rendering the
 * user contacts page.
 *
 * @param state The state object of the current HTTP-Request
 */
exports.show = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "contacts";
	ejs.render(state, '/contacts.tpl');
}

