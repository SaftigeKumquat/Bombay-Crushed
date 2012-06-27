/** @file
 * Functionality required for building the overview page
 *
 * Only function to use externally is show, which will trigger
 * data collection for the overview page and finally cause rendering it.
 */
var ejs = require('./ejs.js');
var lf = require('./lfcli.js');

var user = require('./user.js');
var inis = require('./inis.js');

/**
 * Query all data required for the delegations box on the overview page.
 * 
 * The resolved delegations are stored in `state.context.delegations`.
 *
 * @param state The state object of the current HTTP-Request
 * @param render The callback to notify once all data has been retrieved.
 */
var delegations = function(state, render) {
	var delegations;

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

		console.log('DELEGATIONS: ' + JSON.stringify(links));

		// follow the delegations and resolve the user information
		if(links.length) {
			for(i = 0; i < links.length; i++) {
				console.log('Query trustee name: ' + links[i].trustee_id);
				lf.query('/member', {'member_id': links[i].trustee_id }, state, function(res) {
					var delegate = res.result[0];
					console.log(JSON.stringify(delegate));

					info_obj = {
						user: {
							'name': delegate.name,
							'picsmall': '/avatar/' + delegate.id
						}
					};
					// get last action of user
					lf.query('/vote', {'member_id': delegate.id,
					                   'issue_state': 'finished_with_winner,finished_without_winner',
					                   'issue_closed_after': delegate.last_activity
					                  }, state, function(res) {
						if(res.res && res.res.length > 0) {
							// TODO sort these properly instead of taking an arbitrary one
							vote = res.res[0];
							if(vote.grade.grade > 0) {
								info_obj.action = 'for';
							} else {
								info_obj.action = 'against';
							}
							// get information about the initiative the last action was performed on
							lfapi.query('/initiative', {'initiative_id': vote.initiative_id}, state, function(res) {
								info_obj.title = res.res[0].name;
								resolved_delegations.push(info_obj);
								console.log('Resolved ' + resolved_delegations.length + ' of ' + links.length + ' delegations.');
								// if all delegations have been handled finish it up
								if(resolved_delegations.length === links.length) {
									delegations = resolved_delegations;
									finish();
								}
							});
						} else {
							resolved_delegations.push(info_obj);
							console.log('Resolved ' + resolved_delegations.length + ' of ' + links.length + ' delegations.');
							// if all delegations have been handled finish it up
							if(resolved_delegations.length === links.length) {
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

/**
 * Get the list of areas including membership information.
 *
 * The result will be stored in `state.context.units`.
 *
 * @param state The state object of the current HTTP-Request
 * @param render The external callback function to notify once the data has been collected.
 */
var areas = function(state, render) {
	/** array of area memberships */
	var memberships;
	/** units by id */
	var units;
	/** array of privileges */
	var privs;
	/** areas by id */
	var areas;

	// TODO areas and memberships

	/**
	 * Checks if all data has been fetched. If yes, convert to format required
	 * by template engine, store in state and call external callback.
	 */
	var finish = function() {
		var unit_id, unit, area, i, k;
		/** array of units to be passed to the ui */
		var ui_units = [];

		// TODO this can be done more efficiently using hashes (objects)
		if(units !== undefined && areas !== undefined && memberships !== undefined && privs != undefined) {
			// we don't actually need the priviledges, that should have already given us only the proper units
			for(i = 0; i < areas.length; i++) {
				area = areas[i];
				unit = units[area.unit_id]
				if(unit !== undefined) { // if unit is undefined we aren't a member
					// check if user is a member of the area
					for(k = 0; k < memberships.length; k++) {
						if(memberships[k].area_id === area.id) {
							area.checked = true;
						}
					}
					if(unit.areas === undefined) {
						unit.areas = [];
					}
					unit.areas.push(area);
				}
			}

			for(unit_id in units) {
				var unit = units[unit_id];
				ui_units.push(unit);
			}

			state.context.units = ui_units;
			console.log('Meine Themen: ' + JSON.stringify(state.context.units));
			render();
		}
	}

	// query users units
	lf.query('/privilege', {'member_id': state.user_id(), 'include_units': true}, state,  function(res) {
		privs = res.result;
		units = res.units;
	});

	// query all areas
	lf.query('/area', {}, state, function(res) {
		areas = res.result;
		finish();
	});

	// query membership information
	lf.query('/membership', {'member_id': state.user_id()}, state, function(res) {
		memberships = res.result;
		finish();
	});
}

/**
 * Query information required for the news block on the overview page.
 *
 * Stores its results in `state.context.news`.
 *
 * Parameters used from the HTTP-Query:
 *  * newspage for pagination
 *
 * @param state The state object of the current HTTP request
 * @param render The callback function to notify once the data is available.
 */
var news = function(state, render) {
	var lastBallot, criticalQuorum, voters, votes, activepage;

	// pagination or default page
	if(state.url.query.newspage !== undefined) {
		activepage = state.url.query.newspage - 1;
	}
	else {
		activepage = 0;
	}

	/**
	 * Checks if all data has been fetched. If yes, convert to format required
	 * by template engine, store in state and call external callback.
	 */
	var finish = function() {
		if(lastBallot !== undefined && criticalQuorum !== undefined && voters !== undefined && votes !== undefined) {
			var news = {};

			// handle pagination
			if(state.url.query.newspage !== undefined) {
				news.activepage = state.url.query.newspage;
			}
			else {
				news.activepage = 1;
			}
			
			if(!lastBallot) {
				news.chart = {
					'title': 'No ballot has completed recently',
					'for': 0,
					'fordelegated': 0,
					'against': 0,
					'againstdelegated': 0
				};
			} else {
				// calculate pie-chart  data
				var pVoters = lastBallot.positive_votes;
				var nVoters = lastBallot.negative_votes;
				var pDirect = 0, pIndirect = 0;
				var nDirect = 0, nIndirect = 0;

				var i, j;
				for(i = 0; i < voters.length; ++i) {
					var voter = voters[i];
					for(j = 0; j < votes.length; ++j) {
						var vote = votes[j];
						if(vote.member_id === voter.member_id) { // issue_id should be correct by query restriction
							if(vote.grade > 0) {
								pDirect = pDirect + 1;
								pIndirect = pIndirect + voter.weight - 1;
							}
							if(vote.grade < 0) {
								nDirect = nDirect + 1;
								nIndirect = nIndirect + voter.weight - 1;
							}
						}
					}
				}

				news.chart = {
					'title': lastBallot.name,
					'for': pDirect,
					'fordelegated': pIndirect,
					'against': nDirect,
					'againstdelegated': nIndirect
				};

				news.pages = lastBallot.pages;
			}

			// handle critical quorum default
			if(!criticalQuorum) {
				news.graph = {
					'title': 'Currently no initiative is close to the quorum',
					'quorum': 0,
					'support': 0,
					'potential': 0,
					'uninvolved': 0,
					'supporter': 0,
					'potsupporter': 0,
					'uninterested': 0
				};
			} else {
				news.graph = criticalQuorum;
			}

			// notify caller
			state.context.news = news;
			render();
		}
	}

	// query last ballot
	// erst nach issue fragen, dann winning initiative für den issue abfragen -> weniger daten
	// TODO nach eigenen areas einschränken
	// 1. get issues with issue_state =  finished_with_winner
	// 2. Select initiative closed last (we only got ones with winners -> end of voting time)
	// 3. get winner of that issue
	lf.query('/issue', {'issue_state': 'finished_with_winner'}, state, function(res) {
		var i;
		var issues = res.result;
		var last_timestamp = 0;
		var last_issue;
		console.log('Completed issues: ' + issues.length);

		// sort the issues by closing
		Array.prototype.sort.call(issues, function(a,b) {
    			if (a.closed > b.closed)
        			return -1;
    			else if (b.closed > a.closed)
        			return 1;
    			else 
        			return 0;
		});

		if(issues.length != 0 && activepage <= issues.length) {
			last_issue = issues[activepage];
		}
		if(!last_issue) {
			lastBallot = false;
			voters = false;
			votes = false;
			finish();
		} else {
			lf.query('/initiative', {'initiative_winner': 1, 'issue_id': last_issue.id}, state, function(res) {
				var i;
				lastBallot = res.result[0];
				lastBallot.pages = issues.length;
				// TODO handle no result case (there should always be a result because of finished_with_winner restriction)
				lf.query('/vote', {'initiative_id': lastBallot.id}, state, function(res) {
					votes = res.result || false;
					console.log('Vote: ' + JSON.stringify(votes));
					finish();
				});
			});
			lf.query('/voter', {'issue_id': last_issue.id}, state, function(res) {
				voters = res.result || false;
				console.log('Voter: ' + JSON.stringify(voters));
				finish();
			});
		}
	});

	// object for qorum data collection
	// if all required data has been collected format data for template
	// and call news-function wide calback
	quorumHelper = function() {
		var policies, units, last_activity;

		/**
		 * Callback function used everytime data is stored in the object.
		 * If all data is collected, process and call next level callback.
		 */
		var getIni = function() {
			if(policies !== undefined && units !== undefined && last_activity !== undefined) {
				var requests = 0, responses = 0, initiatives = [];

				var selectTopIni = function() {
					if(responses == requests) {
						if(initiatives.length == 0) {
							criticalQuorum = false;
							finish();
						} else {
							// pick oldes
							var i, oldest_i, oldest_time;
							for(i = 0; i < initiatives.length; ++i) {
								if(oldest_time === undefined || initiatives[i].created < oldest_time) {
									oldest_i = i;
									oldest_time = initiatives[i].created;
								}
							}
							var oldest_ini = initiatives[oldest_i];
							var supporters = oldest_ini.satisfied_supporter_count;
							var potentials = oldest_ini.supporter_count - oldest_ini.satisfied_supporter_count;
							lf.query('/issue', {'id': oldest_ini.issue_id}, state, function(res) {
								var issue = res.result[0];

								var policy, unit;
								for(i = 0; i < policies.length; ++i) {
									if(policies[i].id === issue.policy_id) {
										policy = policies[i];
									}
								}
								for(i = 0; i < units.length; ++i) {
									if(units[i].id === issue.unit_id) {
										unit = units[i];
									}
								}

								// TODO is population really sufficient for quorum?
								var quorum = issue.population * policy.initiative_quorum_num / policy.initiative_quorum_den;
								var not_involved = issue.population - supporters - potentials;

								console.log(quorum + ' ' + issue.population);

								criticalQuorum = {
									'title': oldest_ini.name,
									'quorum': quorum / issue.population * 100,
									'support': supporters / issue.population * 100,
									'potential': potentials / issue.population * 100,
									'uninvolved': not_involved / issue.population * 100,
									'supporter': supporters,
									'potsupporter': potentials,
									'uninterested': not_involved
								}

								console.log(JSON.stringify(criticalQuorum));
								finish();
							});
						}
					}
				}

				// loop over all combinations of policies and units and get inis
				var i, j;
				for(i = 0; i < policies.length; ++i) {
					var policy = policies[i];
					for(j = 0; j < units.length; ++j) {
						var unit = units[j];
						var quorum = unit.member_count * policy.initiative_quorum_num / policy.initiative_quorum_den;

						lf.query('/initiative', {
							'initiative_revoked': false,
							//'initiative_created_after': last_activity,
							'issue_state': 'admission',
							'initiative_supporter_count_below': Math.ceil(quorum),
							'initiative_supporter_count_above': Math.floor(0.8 * quorum)
						}, state, function(res) {
							if(res.result) {
								initiatives = initiatives.concat(res.result);
							}
							++responses;
							selectTopIni();
						});
						++requests;
					}
				}
			}
		};

		// data setters with associated callback function
		return {
			'setPolicies': function(val) { policies = val, getIni() },
			'setUnits': function(val) { units = val, getIni() },
			'setLastActivity': function(val) { last_activity = val; console.log('LAST ACTIVITY: ' + last_activity); getIni() }
		};
	}();

	// run all the queries, results will be handled by helper object
	lf.query('/policy', {}, state, function(res) {
		quorumHelper.setPolicies(res.result || false);
	});
	lf.query('/unit', {}, state, function(res) {
		quorumHelper.setUnits(res.result || false);
	});
	lf.query('/member', {'member_id': state.user_id() }, state, function(res) {
		quorumHelper.setLastActivity(res.result[0].last_activity || false);
	});
};

/**
 * Collect and render all data of the overview page
 *
 * @param state The HTTP-Request state object
 */
exports.show = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var finish = function() {
		var ctx = state.context;
		ctx.meta.currentpage = "overview";
		if(ctx.user !== undefined && ctx.news !== undefined
		   && ctx.units !== undefined && ctx.delegations !== undefined
		   && ctx.inis !== undefined) {
			ejs.render(state, '/main.tpl');
		}
	}

	user.get(state, finish);
	news(state, finish);
	areas(state, finish);
	delegations(state, finish);
	inis(state, finish);
}
