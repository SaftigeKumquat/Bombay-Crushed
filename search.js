var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var inisFunc = require('./inis.js');
var issueFunc = require('./issue.js');

/**
 * Takes care of searching and displaying result
 *
 * @param state The state object of the current HTTP-Request
 */
module.exports.show = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var inisDone = false;
	var inis = [];
	var events = [];

	var finish = function() {
		if(inisDone && inis.length == events.length) {

			// pagination calculation
			state.context.initable = {};
			if(state.url.query.page !== undefined && state.url.query.page > 1) {
				state.context.initable.activepage = state.url.query.page;
				start_ini = (state.url.query.page - 1 ) * 6;
				end_ini = state.url.query.page * 6;
			}
			else {
				state.context.initable.activepage = 1;
				start_ini = 0;
				end_ini = 6;
			}
			state.context.initable.pages = Math.ceil(inis.length / 6);
			state.context.initable.filter = state.url.query.filter;

			state.context.inis = [];

			// fill alert box
			if(inis.length == 0) {
				state.context.alert = {
					'show': true,
					'filter': state.url.query.filter
				};
			}
			else {
				state.context.alert = { 'show': false };
			}

			// collect ini data
			for(var i = start_ini; i < inis.length && i < end_ini; i++) {

				builtIni = {};

				// get event data
				for(var a = 0; a < events.length; a++) {
					if(events[a].initiative_id == inis[i].id) {
						builtIni.lastaction = {};
						date = new Date(events[a].occurrence);
						builtIni.lastaction.date = date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear();
						builtIni.lastaction.time = date.getHours() + ':' + date.getMinutes();
						builtIni.lastaction.action = inisFunc.getTextForEvent(events[a]);
					}
				}

				// collect ini, area, unit, policy and issue data
				builtIni.id = inis[i].id;
				builtIni.title = inis[i].name;
				builtIni.supporter = inis[i].satisfied_supporter_count;
				builtIni.potsupporter = inis[i].supporter_count - inis[i].satisfied_supporter_count;
				builtIni.status = issueFunc.getIssueStateText(ini.issue.state);

				builtIni.area = inis[i].area.name;
				builtIni.area_id = inis[i].area.id;
				builtIni.uninterested = ( inis[i].area.member_weight - builtIni.supporter ) - builtIni.potsupporter;
				if(builtIni.uninterested < 0) {
					builtIni.uninterested = 0;
				}
				builtIni.unit = inis[i].unit.name;

				quorum_num = inis[i].policy.issue_quorum_num;
				quorum_den = inis[i].policy.issue_quorum_den;

				var total = builtIni.supporter + builtIni.potsupporter + builtIni.uninterested;
				builtIni.support = Math.floor(( builtIni.supporter / total ) * 100);
				builtIni.potential = Math.floor(( builtIni.potsupporter / total ) * 100);
				builtIni.uninvolved = Math.floor(( builtIni.uninterested / total ) * 100);
				builtIni.quorum = Math.floor(100 * quorum_num / quorum_den);

				state.context.inis.push(builtIni);
			}

			var ctx = state.context;
			ctx.meta.currentpage = "search";
			ejs.render(state, '/result.tpl');			
		}
	}
	
	// decide on base query
	if(state.url.query.filter !== undefined) {
		if(state.url.query.filter == 'initiated') {
			query = '/initiator';
			query_obj = { 'member_id': state.user_id() };
		}
		else if(state.url.query.filter == 'supported') {
			query = '/supporter';
			query_obj = { 'member_id': state.user_id(), 'snapshot': 'latest' };
		}
		else {
			state.fail_invalidResource('Filter not found.', 400);
		}
	}
	else {
		state.fail_invalidResource('Filter not found.', 400);
	}

	// get all my filtered initiatives
	lf.query(query, query_obj, state, function(res) {

		// collect the ini ids
		var ini_ids = [];
		for(var i = 0; i < res.result.length; i ++) {
			ini_ids.push(res.result[i].initiative_id);
		}

		if(ini_ids.length > 0) {
			// query the initiative data
			lf.query('/initiative', {'initiative_id': ini_ids.toString(), 'include_issues': 1, 'include_areas': 1, 'include_units': 1, 'include_policies': 1}, state, function(ini_res) {

				for(var i = 0; i < ini_res.result.length; i++) {
					// get last event per initiative
					lf.query('/event', {'initiative_id': ini_res.result[i].id}, state, function(event_res) {
						// sort events by date
						Array.prototype.sort.call(event_res.result, function(a,b) {
    							if (a.created > b.created)
        							return -1;
    							else if (a.created < b.created)
        							return 1;
    							else 
        							return 0;
						});
						events.push(event_res.result[0]);
						finish();
					});
					ini = ini_res.result[i];
					ini.issue = ini_res.issues[ini.issue_id];
					ini.area = ini_res.areas[ini.issue.area_id];
					ini.unit = ini_res.units[ini.area.unit_id];
					ini.policy = ini_res.policies[ini.issue.policy_id];

					inis.push(ini_res.result[i]);
				}
				inisDone = true;
				finish()
			});
		}
		else {
			// there will be no result, mark that query is complete
			inisDone = true;
		}
		finish();
	});

}
