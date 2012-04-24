#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var Cookies = require('cookies');
var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var querystring = require('querystring');
var url = require('url');

var delegations = function(state, render) {
	var delegations;

	var finish = function() {
		if(delegations !== undefined) {
			state.context.delegations = delegations;
			render();
		}
	}

	lf.query('/delegation', {
		'member_id': state.user_id(),
		'direction': 'out'
	}, function(res) {
		var links = res.result;
		var i, resolved = 0;
		var resolved_delegations = [];

		console.log('DELEGATIONS: ' + JSON.stringify(links));

		if(links.length) {
			for(i = 0; i < links.length; i++) {
				console.log('Query trustee name: ' + links[i].trustee_id);
				lf.query('/member', {'member_id': links[i].trustee_id, 'session_key': state.session_key()}, function(res) {
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
					                   'issue_closed_after': delegate.last_activity,
					                   'session_key': state.session_key()
					                  }, function(res) {
						if(res.res && res.res.length > 0) {
							// TODO sort these properly instead of taking an arbitrary one
							vote = res.res[0];
							if(vote.grade.grade > 0) {
								info_obj.action = 'for';
							} else {
								info_obj.action = 'against';
							}
							lfapi.query('/initiative', {'initiative_id': vote.initiative_id}, function(res) {
								info_obj.title = res.res[0].name;
								resolved_delegations.push(info_obj);
								console.log('Resolved ' + resolved_delegations.length + ' of ' + links.length + ' delegations.');
								if(resolved_delegations.length === links.length) {
									delegations = resolved_delegations;
									finish();
								}
							});
						} else {
							resolved_delegations.push(info_obj);
							console.log('Resolved ' + resolved_delegations.length + ' of ' + links.length + ' delegations.');
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

var areas = function(state, render) {
	var units, areas, memberships;

	// TODO areas and memberships

	// data output
	var finish = function() {
		var i, j, k;
		// TODO this can be done more efficiently using hashes (objects)
		if(units !== undefined && areas !== undefined && memberships !== undefined) {
			// TODO filter all units of which you cannot become a member
			for(i = 0; i < units.length; i++) {
				units[i].areas = [];
			}

			for(i = 0; i < areas.length; i++) {
				area = areas[i];
				for(j = 0; j < units.length; j++) {
					if(units[j].id === area.unit_id) {
						// check if user is a member of the area
						for(k = 0; k < memberships.length; k++) {
							if(memberships[k].area_id === area.id) {
								area.checked = true;
							}
						}
						units[j].areas.push(area);
					}
				}
			}

			state.context.units = units;
			render();
		}
	}

	lf.query('/unit', {}, function(res) {
		units = res.result;
		finish();
	});

	lf.query('/area', {}, function(res) {
		areas = res.result;
		finish();
	});

	lf.query('/membership', {'member_id': state.user_id()}, function(res) {
		memberships = res.result;
		finish();
	});
}


var news = function(state, render) {
	var lastBallot, criticalQuorum, voters, votes;

	// data output
	var finish = function() {
		if(lastBallot !== undefined && criticalQuorum !== undefined && voters !== undefined && votes !== undefined) {
			var news = {};
			if(!lastBallot) {
				news.chart = {
					'title': 'No ballot has completed recently',
					'for': 0,
					'fordelegated': 0,
					'against': 0,
					'againstdelegated': 0
				};
			} else {
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
			}

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
	lf.query('/issue', {'issue_state': 'finished_with_winner'}, function(res) {
		var i;
		var issues = res.result;
		var last_timestamp = 0;
		var last_issue;
		console.log('Completed issues: ' + issues.length);
		for(i = 0; i < issues.length; ++i) {
			var issue = issues[i];
			closing_time = Date.parse(issue.closed);
			if(closing_time > last_timestamp) {
				last_timestamp = closing_time;
				last_issue = issue;
			}
		}
		if(!last_issue) {
			lastBallot = false;
			voters = false;
			votes = false;
			finish();
		} else {
			lf.query('/initiative', {'initiative_winner': true, 'issue_id': last_issue.id}, function(res) {
				var i;
				lastBallot = res.result[0];
				// TODO handle no result case (there should always be a result because of finished_with_winner restriction)
				lf.query('/vote', {'initiative_id': lastBallot.id}, function(res) {
					votes = res.result || false;
					console.log('Vote: ' + JSON.stringify(votes));
					finish();
				});
			});
			lf.query('/voter', {'issue_id': last_issue.id}, function(res) {
				voters = res.result || false;
				console.log('Voter: ' + JSON.stringify(voters));
				finish();
			});
		}
	});

	// query critical Quorum
	quorumHelper = function() {
		var policies, units, last_activity;

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
							lf.query('/issue', {'id': oldest_ini.issue_id}, function(res) {
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
						}, function(res) {
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

		return {
			'setPolicies': function(val) { policies = val, getIni() },
			'setUnits': function(val) { units = val, getIni() },
			'setLastActivity': function(val) { last_activity = val; console.log('LAST ACTIVITY: ' + last_activity); getIni() }
		};
	}();
	
	lf.query('/policy', {}, function(res) {
		quorumHelper.setPolicies(res.result || false);
	});
	lf.query('/unit', {}, function(res) {
		quorumHelper.setUnits(res.result || false);
	});
	lf.query('/member', {'member_id': state.user_id(), 'session_key': state.session_key()}, function(res) {
		quorumHelper.setLastActivity(res.result[0].last_activity || false);
	});
};

var inis = function(state, render) {
	var events = [];
	var issues = [];
	var areas = [];
	var units = [];
	var inis = [];
	var policies = [];

	var activepage;	
	state.context.initable = {};
	if(state.url.query.page !== undefined) {
		activepage = state.url.query.page - 1;
		state.context.initable.activepage = state.url.query.page;
	}
	else {
		activepage = 0;
		state.context.initable.activepage = 1;
	}
 
	var finish = function() {
		builtInis = [];
		if(events.length === issues.length
			&& events.length === areas.length
			&& events.length === units.length
			&& events.length === inis.length
			&& events.length === policies.length) {

			for(var i = 0; i < events.length; i++) {
				var ini = { lastaction: {} };
				date = new Date(events[i].occurrence);
				ini.lastaction.date = date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear();
				ini.lastaction.time = date.getHours() + ':' + date.getMinutes();
				switch(events[i].event) {
					case "initiative_created_in_existing_issue":
						ini.lastaction.action = "Neue Initiative";
						break;
					case "initiative_created_in_new_issue":
						ini.lastaction.action = "Neues Thema";
						break;
					case "suggestion_created":
						ini.lastaction.action = "Neue Anregung";
						break;
					case "new_draft_created":
						ini.lastaction.action = "Neuer Entwurf";
						break;
					case "initiative_revoked":
						ini.lastaction.action = "Initative zurückgezogen";
						break;
					case "issue_state_changed":
						switch(events[i].state) {
							case "finished_with_winner":
								ini.lastaction.action = "Abstimmung beendet";
								break;
							case "verification":
								ini.lastaction.action = "Thema eingefroren";
								break;
							case "voting":
								ini.lastaction.action = "Abstimmung begonnen";
								break;
							case "discussion":
								ini.lastaction.action = "Thema zugelassen";
								break;
							case "admission":
								ini.lastaction.action = "Neues Thema";
								break;
							case "finished_without_winner":
								ini.lastaction.action = "Thema Abgebrochen";
								break;
						}
						break;
				}
				switch(events[i].state) {
					case "finished_with_winner":
						ini.status = "5.Abgeschlossen";
						break;
					case "verification":
						ini.status = "3.Eingefroren";
						break;
					case "voting":
						ini.status = "4.Abstimmung";
						break;
					case "discussion":
						ini.status = "2.Diskussion";
						break;
					case "admission":
						ini.status = "1.Neu";
						break;
					case "finished_without_winner":
						ini.status = "Abgebrochen";
						break;
				}
				for(var j = 0; j < inis.length; j++) {
					if(inis[j].issue_id === events[i].issue_id) {
						ini.id = inis[j].id;
						ini.title = inis[j].name;
						ini.supporter = inis[j].satisfied_supporter_count;
						ini.potsupporter = inis[j].supporter_count - inis[j].satisfied_supporter_count;
					}
				}
				var quorum_num, quorum_den;
				for(var a = 0; a < issues.length; a++) {
					if(issues[a].id === events[i].issue_id) {
						for(var b = 0; b < areas.length; b++) {
							if(areas[b].id === issues[a].area_id) {
								ini.area = areas[b].name;
								// TODO number for uninterested is sometimes negative?
								ini.uninterested = ( areas[b].member_weight - ini.supporter ) - ini.potsupporter;
								if(ini.uninterested < 0) {
									ini.uninterested = 0;
								}
								for(var c = 0; c < units.length; c++) {
									if(units[c].id === areas[b].unit_id) {
										ini.unit = units[c].name;
									}
								}
							}
						}
						for(var k = 0; k < policies.length; k++) {
							if(issues[a].policy_id === policies[k].id) {
								quorum_num = policies[k].issue_quorum_num;
								quorum_den = policies[k].issue_quorum_den;
							}
						}
					}
				}
				var total = ini.supporter + ini.potsupporter + ini.uninterested;
				ini.support = Math.floor(( ini.supporter / total ) * 100);
				ini.potential = Math.floor(( ini.potsupporter / total ) * 100);
				ini.uninvolved = Math.floor(( ini.uninterested / total ) * 100);
				ini.quorum = Math.floor(total * quorum_num / quorum_den);
				builtInis.push(ini);
			}
			state.context.inis = builtInis;
			render();			
		}
	}

	// get last events
 	lf.query('/event', {}, function(res) {
		// consider max 5
		// TODO must consider page index in table
		state.context.initable.pages = Math.ceil(res.result.length / 5);
		var end = ( activepage * 5 ) + 5;
		var found = false;
		for(var i = activepage * 5; i < res.result.length && i < end; i++) {
			found = false;
			// check if event has issue that was already registered
			for(var l = 0; l < events.length; l++) {
				if(events[l].issue_id == res.result[i].issue_id) {
					found = true;
					break;
				}
			}
			if(found == false) {
				events.push(res.result[i]);
			}
			else {
				end = end + 1;
				continue;
			}
			// get issue for event
			lf.query('/issue', {'issue_id': res.result[i].issue_id}, function(issue_res) {
				issues.push(issue_res.result[0]);
				// get area for issue
				lf.query('/area', {'area_id': issue_res.result[0].area_id}, function(area_res) {
					areas.push(area_res.result[0]);
					// get unit for area
					lf.query('/unit', {'unit_id': area_res.result[0].unit_id}, function(unit_res) {
						units.push(unit_res.result[0]);						
						finish();
					});
					finish();
				});
				// get policy for issue
				lf.query('/policy', {'policy_id': issue_res.result[0].policy_id}, function(pol_res) {
					policies.push(pol_res.result[0]);
					finish();
				});
				// get inis for issue
				lf.query('/initiative', {'issue_id': issue_res.result[0].id}, function(ini_res) {
					// get the leading ini
					var found = false;
					for(var j = 0; j < ini_res.result.length; j++) {
						if(ini_res.result[j].rank === 1) {
							inis.push(ini_res.result[j]);	
							found = true;						
						}
					}
					if(found === false) {
						var leadingIni = ini_res.result[0];
						for(var j = 0; j < ini_res.result.length; j++) {
							if(leadingIni.satisfied_supporter_count < ini_res.result[j].satisfied_supporter_count) {
								leadingIni = ini_res.result[j];
							}
						}
						inis.push(leadingIni);
					}
					finish();
				});
				finish();
			});
		}
		finish();
	});
};

// Ok, not really an index, but works.
var printIndex = function(state) {
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

	lf.query('/member', {'member_id': state.user_id()}, function(res) {
		lf_user = res.result[0];
		state.context.user = {
			'nick': lf_user.name,
			'picbig': '/picbig/' + lf_user.id
		};
		finish();
	} );

	news(state, finish);
	areas(state, finish);
	delegations(state, finish);
	inis(state, finish);
}

var showTopics = function(state) {
	var ctx = state.context;
	ctx.meta.currentpage = "topics";
	ejs.render(state, '/topics.tpl');
}

var showProfile = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "profile";
	ejs.render(state, '/profile.tpl');
}

var showContacts = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "contacts";
	ejs.render(state, '/contacts.tpl');
}

var showTimeline = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var ctx = state.context;
	ctx.meta.currentpage = "timeline";
	ejs.render(state, '/timeline.tpl');
}

var invalidURL = function(state) {
	var res = state.result;
	res.writeHead(404, {'Content-Type': 'text/plain'});
	res.end('Kuckst du woanders!\n');
}

var serverError = function(state, logmessage, errorcode) {
	if(!errorcode) {
		errorcode = 500;
	}

	console.error('ERROR: ' + logmessage + ' – Sent code ' + errorcode + ' to the client');
	console.trace();

	var res = state.result;
	res.writeHead(500, {'Content-Type': 'text/plain'});
	res.end('I feel blue. Guess I\'ll go swimming!\n');
}

var performLogin = function(state) {
	// get form data
	if(state.request.method !== 'POST') {
		state.sendToLogin();
		return;
	}

	// collect data
	body = '';

	state.request.on('data', function(chunk) {
		body += chunk;
	});

	state.request.on('end', function() {
		data = querystring.parse(body);
		lf.perform('/session', { key: data.key }, function(res) {
			state.session_key(res.session_key);

			lf.query('/info', { session_key: state.session_key() }, function(res) {
				state.user_id(res.current_member_id);
				printIndex(state);
			});
		});
	});
}

var performLogout = function(state) {
	// *nom* *nom*
	state.session_key(null);
	state.user_id(null);
	// and run
	printIndex(state);
}

var serveStatic = function(state) {
	// TODO guess content type

	// stream from file to requestee
	// TODO could probably be read chunkwise
	filepath = __dirname + '/html' + state.request.url;
	console.log('Serving: ' + filepath);
	fs.readFile(filepath, function(err, data) {
		if(err) {
			invalidURL(state);
			return;
		}
		state.result.end(data);
		console.log('Served: ' + filepath);
	});
}

var sendPicture = function(state) {
	var user_id = state.request.url.slice('/picbig/'.length);
	console.log('Retrieving portrait for user ' + user_id);
	var query_obj = {
		'type': 'photo',
		'member_id': user_id
	}
	if(state.session_key()) {
		query_obj.session_key = state.session_key()
	};
	lf.query('/member_image', query_obj, function(result) {
		var response = state.result;
		if(result.status === 'ok' && result.result.length) {
			var image = result.result[0];
			response.setHeader("Content-Type", image.content_type);
			buf = new Buffer(image.data, 'base64');
			response.write(buf);
			response.end();
		} else {
			state.fail('No image found for user ' + user_id, 404);
		}
	});
}

var sendAvatar = function(state) {
	var user_id = state.request.url.slice('/avatar/'.length);
	console.log('Retrieving avatar for user ' + user_id);
	var query_obj = {
		'type': 'avatar',
		'member_id': user_id
	}
	if(state.session_key()) {
		query_obj.session_key = state.session_key()
	};
	lf.query('/member_image', query_obj, function(result) {
		var response = state.result;
		if(result.status === 'ok' && result.result.length) {
			var image = result.result[0];
			response.setHeader("Content-Type", image.content_type);
			buf = new Buffer(image.data, 'base64');
			response.write(buf);
			response.end();
		} else {
			state.fail('No avatar found for user ' + user_id, 404);
		}
	});
}

/**
 * Mapping from URLs to functions
 */
var url_mapping = {
	'/': printIndex,
	'/index.html': printIndex,
	'/overview': printIndex,
	'/login': performLogin,
	'/logout': performLogout,
	'/topics': showTopics,
	'/profile': showProfile,
	'/contacts': showContacts,
	'/timeline': showTimeline
}

/**
 * Mapping from patterns to functions
 */
var pattern_mapping = [
	{ pattern: '/picbig/', mapped: sendPicture },
	{ pattern: '/avatar/', mapped: sendAvatar },
	{ pattern: '/css/', mapped: serveStatic },
	{ pattern: '/js/', mapped: serveStatic },
	{ pattern: '/img/', mapped: serveStatic },
	{ pattern: '/content_img/', mapped: serveStatic },
	{ pattern: /^\/\w+\.html/, mapped: serveStatic }
];

/**
 * Function to Map URLs to functions
 */
mapU2F = function(state, url_mappings, pattern_mappings) {
	// Forward decleration of variables as recommended by Crockford
	var i;
	var mapped;

	var path = state.url.pathname;

	console.log('Request url: ' + path);

	// check whether the url has a direct mapping
	mapped = url_mappings[path];
	if (mapped) {
		mapped(state);
	} else {
		// url did not match any of the direct mappingss
		// check whether it matches anny of the patterns
		for (i = 0; !mapped && i < pattern_mappings.length; i = i + 1) {
			pattern = pattern_mappings[i].pattern;
			//console.log('Testing pattern ' + i + ': ' + pattern + ' [' + typeof(pattern) + ']');
			if( typeof(pattern) === 'string' && path.slice(0, pattern.length) === pattern ) {
				mapped = pattern_mappings[i].mapped;
			} else if ( pattern.test && typeof(pattern.test) === 'function' && pattern.test(path) ) {
				// we can only assume it's a regexp, as typeof is not clear on it,
				// but if it has a test function...
				mapped = pattern_mappings[i].mapped;
			}
		}
		if (mapped) {
			mapped(state);
		} else {
			console.log(path + ' has not been mapped');
			invalidURL(state);
		}
	}
}

/**
 * Create an object that keeps the state during a full request / response
 * cycle. This state will not be kept between request. It's purpose is to
 * bundle all data collected while building the response to one request.
 */
var createState = function(req, res) {
	var state = {
		'request': req,
		'result': res,
		'fail': function(logmessage, errorcode) {
			serverError(state, logmessage, errorcode);
		},
		'cookies': new Cookies(req, res),
		'sendToLogin': function(message) {
			// TODO pass message to template
			ejs.render(state, '/login.tpl');
		},
		'context': {
				'meta': {'currentpage': ''}
		},
		'url': url.parse(req.url, true)
	};

	var session_key, user_id;

	// convenience..
	state.session_key = function(key) {
		if(key === undefined) {
			if(session_key === undefined) {
				session_key = state.cookies.get('session_key');
			}
			return session_key;
		} else {
			session_key = key;
			state.cookies.set('session_key', session_key);
			return session_key;
		}
	}
	state.user_id = function(id) {
		if(id === undefined) {
			if(user_id === undefined) {
				user_id = state.cookies.get('user_id');
			}
			return user_id;
		} else {
			user_id = id;
			state.cookies.set('user_id', user_id);
			return user_id;
		}
	}

	return state;
}

server = function() {
	// make sure uncaught exceptions don't kill the server
	process.on('uncaughtException', function (err) {
		if(err.stack) {
			err = err.stack;
		}
		console.error('ERROR: Exception not handled properly: ' + err);
	});

	lf.query('/info', {}, function(res) {
		server = lf.getBaseURL();
		console.log('Connected to ' + server.host + ':' + server.port);
		console.log('Core Version: ' + res.core_version);
		console.log('API Version:  ' + res.api_version);
	});

	http.createServer(function (req, res) {
		var state = createState(req, res);
		mapU2F(state, url_mapping, pattern_mapping);
	}).listen(8080);
	console.log('Server running at port 8080');

};

server();
