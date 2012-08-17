var lf = require('./lfcli.js');
var issueFunc = require('./issue.js');

exports.show = function(state, render) {
	var initiative_id = state.url.query.initiative_id;
	var builtIni = {};
	var initiative;
	var issue;
	var area;
	var unit;
	var policy;
	var draft;
	var iniDone = false;
	var draftDone = false;

	var finish = function() {
		if(iniDone && draftDone) {
			builtIni.id = initiative_id;
			builtIni.name = initiative.name;
			builtIni.area = {};
			builtIni.area.id = area.id;
			builtIni.area.name = area.name;
			builtIni.issue = {};
			builtIni.issue.id = issue.id;
			builtIni.policy = policy.name;
			builtIni.text = draft.content;
			builtIni.state = issueFunc.getIssueStateText(issue.state);
			
			builtIni.authors = [];
			builtIni.drafts = [];
			builtIni.supporters = [];
			builtIni.suggestions = [];
			builtIni.alternativeinis = [];
			
			state.context.initiative = builtIni;
			render();
		}
	}

	// get the initiative
	lf.query('/initiative', { 'initiative_id': initiative_id, 'include_issues': 1, 'include_areas': 1, 'include_policies': 1, 'include_units': 1 }, state, function(ini_res) {
		initiative = ini_res.result[0];
		issue = ini_res.issues[initiative.issue_id];
		area = ini_res.areas[issue.area_id];
		unit = ini_res.units[area.unit_id];
		policy = ini_res.policies[issue.policy_id];

		iniDone = true;
		finish();
	});

	lf.query('/draft', { 'initiative_id': initiative_id, 'current_draft': 1 }, state, function(draft_res) {
		draft = draft_res.result[0];
		
		draftDone = true;
		finish();
	});
}
