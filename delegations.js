/**
 * Utility functions for querying delegations
 */
var lf = require('./lfcli.js');
var userFunc = require('./user.js');

// Basic functions on JS objects
var registerFunctions = function() {
/**
 * checks if an object is contained in an array
 *
 * @param obj object to be checked
 */
	Array.prototype.contains = function(obj) {
    		for (var i = 0; i < this.length; i++) {
        		if (this[i] === obj) {
            			return true;
        		}
    		}
    		return false;
	}
}

/**
 * Query all data required for the delegations box on the overview page
 * and the delegations display on the contacts page.
 *
 * The resolved delegations are stored in `state.context.delegations`.
 *
 * @param state The state object of the current HTTP-Request
 * @param render The callback to notify once all data has been retrieved.
 */
exports.lastActions = function(state, render) {
	var delegations;

	registerFunctions();

	/**
	 * Wrapper for the external callback that stores the results into
	 * the state object before invoking the external callback.
	 */
	var finish = function() {
		if(delegations !== undefined) {
			state.context.delegations = delegations;
			render();
		}
	}

	// Query all outgoing delegations of the current user
	lf.query('/delegation', {
		'member_id': state.user_id(),
		'direction': 'out'
	}, state, function(res) {
		var links = res.result;
		var i, resolved = 0;
		var resolved_delegations = [];
		var pending_resolves = 0;
		var trustees = [];

		// follow the delegations and resolve the user information
		if(links.length) {
			for(i = 0; i < links.length; i++) {
				
				// check we don't query a trustee twice
				if(trustees.contains(links[i].trustee_id)) {
					continue;
				}
				else {
					trustees.push(links[i].trustee_id);
					pending_resolves++; // don't finish until we know who it is and what he did
					console.log('Query trustee name: ' + links[i].trustee_id);
				}

				lf.query('/member', {'member_id': links[i].trustee_id }, state, function(res) {
					var delegate = res.result[0];
					console.log(JSON.stringify(delegate));

					var info_obj = {
						'user': userFunc.getUserBasic(delegate)
					};
					// get last action of user
					lf.query('/vote', {'member_id': delegate.id,
					                   'issue_state': 'finished_with_winner,finished_without_winner'
					                  }, state, function(res) {
						if(res.result && res.result.length > 0) {
							console.log(JSON.stringify(res));
							// TODO sort these properly instead of taking an arbitrary one
							vote = res.result[0];
							if(vote.grade.grade > 0) {
								info_obj.action = 'for';
							} else {
								info_obj.action = 'against';
							}
							// get information about the initiative the last action was performed on
							lf.query('/initiative', {'initiative_id': vote.initiative_id}, state, function(res) {
								info_obj.title = res.result[0].name;
								info_obj.initiative_id = res.result[0].id;
								resolved_delegations.push(info_obj);
								pending_resolves--; // we now know what she did
								// if all delegations have been handled finish it up
								if(pending_resolves === 0) {
									delegations = resolved_delegations;
									finish();
								}
							});
						} else {
							pending_resolves--; // we now know that this guy didn't do anything
							// if all delegations have been handled finish it up
							if(pending_resolves === 0) {
								delegations = resolved_delegations;
								finish();
							}
						}
					});
				});
			}
		} else {
			delegations = [];
			finish();
		}
	});
};


