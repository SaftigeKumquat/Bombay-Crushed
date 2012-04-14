#!/usr/bin/env node

var http = require('http');
var fs = require('fs');
var Cookies = require('cookies');
var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var querystring = require('querystring');

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
				lf.query('/member', {'member_id': links[i].trustee_id}, function(res) {
					var delegate = res.result[0];
					console.log(JSON.stringify(delegate));
					resolved_delegations.push({
						user: {
							'name': delegate.name,
							'picsmall': '/avatar/' + delegate.id
							// TODO fill info about last initivative or hide
						}
					});
					console.log('Resolved ' + resolved_delegations.length + ' of ' + links.length + ' delegations.');
					if(resolved_delegations.length === links.length) {
						delegations = resolved_delegations;
						finish();
					}
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
					if(voter.delegate_member_id) {
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
					console.log('Vote: ' + voters);
					finish();
				});
			});
			lf.query('/voter', {'issue_id': last_issue.id}, function(res) {
				voters = res.result || false;
				console.log('Voter: ' + voters);
				finish();
			});
		}
	});

	// query critical Quorum
	console.error('Query for critical quorum: not implemented');
	criticalQuorum = false;
	finish();
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
		   && ctx.units !== undefined && ctx.delegations !== undefined) {
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
}

var showProfile = function(state) {
	var ctx = state.context;
	ctx.meta.currentpage = "profile";
	ejs.render(state, '/profile.tpl');
}

var showContacts = function(state) {
	var ctx = state.context;
	ctx.meta.currentpage = "contacts";
	ejs.render(state, '/contacts.tpl');
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
	'/login': performLogin,
	'/logout': performLogout,
	'/profile.html': showProfile,
	'/contacts.html': showContacts
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

	var req = state.request;

	console.log('Request url: ' + req.url);

	// check whether the url has a direct mapping
	mapped = url_mappings[req.url];
	if (mapped) {
		mapped(state);
	} else {
		// url did not match any of the direct mappingss
		// check whether it matches anny of the patterns
		for (i = 0; !mapped && i < pattern_mappings.length; i = i + 1) {
			pattern = pattern_mappings[i].pattern;
			//console.log('Testing pattern ' + i + ': ' + pattern + ' [' + typeof(pattern) + ']');
			if( typeof(pattern) === 'string' && req.url.slice(0, pattern.length) === pattern ) {
				mapped = pattern_mappings[i].mapped;
			} else if ( pattern.test && typeof(pattern.test) === 'function' && pattern.test(req.url) ) {
				// we can only assume it's a regexp, as typeof is not clear on it,
				// but if it has a test function...
				mapped = pattern_mappings[i].mapped;
			}
		}
		if (mapped) {
			mapped(state);
		} else {
			console.log(req.url + ' has not been mapped');
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
		}
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
	}).listen(1337, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:1337/');

};

server();
