#!/usr/bin/env node

/** @file
 * A command line utility to test the API and the lfcli implementation.
 */

// Load modules
var lfcli = require('./lfcli.js');

// Define all actions
actions = {};

actions.info = function() {
	lfcli.query('/info', {}, function(res) {
		console.log('Core Version: ' + res.core_version);
		console.log('API Version:  ' + res.api_version);
	});
};
actions.info.help = 'Get general information on the server.';

actions.member_count = function() {
	lfcli.query('/member_count', {}, function(res) {
		console.log('Members: ' + res.total_count);
	});
};
actions.member_count.help = 'Get the number of members registered.';

actions.members = function() {
	lfcli.query('/member', {}, function(res) {
		var i;
		var members = res.result;
		for(i = 0; i < members.length; ++i) {
			var member = members[i];
			console.log('Member: ' + member.name);
		}
	});
};
actions.members.help = 'Get member list.';

actions.policies = function() {
	lfcli.query('/policy', {}, function(res) {
		var i;
		var policies = res.result;
		console.log('Policies: ' + policies.length);
		for(i = 0; i < policies.length; ++i) {
			var policy = policies[i];
			console.log('Policy: ' + policy.name);
		}
	});
};
actions.policies.help = 'Get list of policies';

actions.units = function() {
	lfcli.query('/unit', {}, function(res) {
		var i;
		var units = res.result;
		console.log('Units: ' + units.length);
		for(i = 0; i < units.length; ++i) {
			var unit = units[i];
			console.log('Unit: ' + unit.name);
		}
	});
};
actions.units.help = 'Get list of units';

actions.areas = function() {
	lfcli.query('/area', {}, function(res) {
		var i;
		var areas = res.result;
		console.log('Areas: ' + areas.length);
		for(i = 0; i < areas.length; ++i) {
			var area = areas[i];
			console.log('Area: ' + area.name);
		}
	});
};
actions.areas.help = 'Get list of areas';

actions.issues = function() {
	lfcli.query('/issue', {}, function(res) {
		var i;
		var issues = res.result;
		console.log('Issues: ' + issues.length);
		for(i = 0; i < issues.length; ++i) {
			var issue = issues[i];
			console.log('Issue: ' + issue.state);
		}
	});
};
actions.issues.help = 'Get list of issues';

actions.initiatives = function() {
	lfcli.query('/initiative', {}, function(res) {
		var i;
		var initiatives = res.result;
		console.log('Initiatives: ' + initiatives.length);
		for(i = 0; i < initiatives.length; ++i) {
			var initiative = initiatives[i];
			console.log('Initiative: ' + initiative.name);
		}
	});
};
actions.initiatives.help = 'Get list of initiatives';

actions.session = function() {
	// TODO better argument handling
	if(process.argv.length > 3) {
		var api_key = process.argv[3];
		lfcli.perform('/session', { key: api_key }, function(res) {
			console.log('Session key: ' + res.session_key);
		} );
	} else {
		console.error('You must provide an API key');
	}
}
actions.session.help = 'Start a session with the API server. Requires API key as additinal argument.';

actions.news = function() {
	var lastBallot, criticalQuorum;

	// data output
	var finish = function() {
		if(lastBallot !== undefined && criticalQuorum !== undefined) {
			console.log('Got all data');
			if(!lastBallot) {
				console.log('No initiative has been passed recently');
			} else {
				console.log('Last Ballot: ' + lastBallot.name);
			}

			if(!criticalQuorum) {
				console.log('Currently no initiative is close to the quorum');
			} else {
				console.log('Critical Quorum: ' + criticalQuorum.name);
			}
		}
	}

	// query last ballot
	// erst nach issue fragen, dann winning initiative für den issue abfragen -> weniger daten
	// TODO nach eigenen areas einschränken
	// 1. get issues with issue_state =  finished_with_winner
	// 2. Select initiative closed last (we only got ones with winners -> end of voting time)
	// 3. get winner of that issue
	lfcli.query('/issue', {'issue_state': 'finished_with_winner'}, function(res) {
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
			finish();
		} else {
			lfcli.query('/initiative', {'initiative_winner': true, 'issue_id': last_issue.id}, function(res) {
				var i;
				lastBallot = res.result();
				// TODO handle no result case (there should always be a result because of finished_with_winner restriction)
				finish();
			});
		}
	});

	// query critical Quorum
	console.error('Not implemented');
	criticalQuorum = false;
	finish();
};
actions.news.help = 'Show the news as found on the Bombay Chrushed start page';

actions.help = function() {
	console.log('Invocation: apicli.js [action]');
	console.log('\nAvailable actions:');
	for(action in actions) {
		if(actions.hasOwnProperty(action)) {
			console.log('  ' + action + ': ' + actions[action].help);
		}
	}
};
actions.help.help = 'Show this help';

// specify what to do if no argument is given
actions.default = actions.help;

// Get arguments from Script
if(process.argv.length > 2) {
	var argument = process.argv[2];
	if(actions.hasOwnProperty(argument) && typeof(actions[argument]) == 'function') {
		actions[argument]();
	} else {
		actions.help();
	}
} else {
	actions.default();
}
