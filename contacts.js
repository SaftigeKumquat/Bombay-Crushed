/** @file
 * Functionality required for building the contacts page
 *
 * Only function to use externally is show, which will trigger
 * data collection for the overview page and finally cause rendering it.
 */

var ejs = require('./ejs.js');
var delegations = require('./delegations');

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

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "contacts";
		if(ctx.delegations !== undefined) {
			ejs.render(state, '/contacts.tpl');
		}
	}

	delegations.lastActions(state, finish);
}

