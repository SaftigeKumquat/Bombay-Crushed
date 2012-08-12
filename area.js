var lf = require('./lfcli.js');

var area = function(state, render) {
	var area_id = state.url.query.area_id;
	var builtArea = {};
	var issues = [];
	var policies = [];
	var interest = [];
	var membershipDone = false;
	var issueDone = false;
	var finish = function() {
		if(builtArea.name && builtArea.unit
			&& membershipDone == true && issueDone == true
			&& interest.length == issues.length) {

			var builtIssue = {};
			for(var i = 0; i < issues.length; i++) {
				builtIssue.id = issues[i].id;

				for(var a = 0; a < interest.length; a++) {
					if(interest[a].issue_id == builtIssue.id && interest[a].iwatchissue == true) {
						builtIssue.iwatchissue = true;
					}
				}

				builtArea.issues.push(builtIssue);
			}

			state.context.area = builtArea;
			render();
		}
	}

	var issue_id;

	// get the area
	lf.query('/area', { 'area_id': area_id, 'include_units': 1 }, state, function(res) {
		builtArea.name = res.result[0].name;
		builtArea.unit = res.units[res.result[0].unit_id].name;

		lf.query('/issue', { 'area_id': area_id, 'include_policies': 1 }, state, function(issue_res) {
			for(var i = 0; i < issue_res.result.length; i++) {
				issues.push(issue_res.result[i]);

				issue_id = issue_res.result[i].id;
				console.log('TEST:' + JSON.stringify(issue_res));
				lf.query('/interest', { 'issue_id': issue_id, 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(interest_res) {
					console.log('TEST:' + JSON.stringify(interest_res));
					if(interest_res.result.length > 0) {
						interest.push({ 'issue_id': issue_id, 'iwatchissue': true});
					}
					else {
						interest.push({ 'issue_id': issue_id, 'iwatchissue': false});
					}
					finish();
				});
			}
			policies = issue_res.policies;

			issueDone = true;
			finish();
		});

		lf.query('/membership', { 'area_id': area_id }, state, function(member_res) {
			for(var i = 0; i < member_res.result.length; i++) {
				if(member_res.result[i].member_id == state.user_id()) {
					builtArea.member = true;
					break;
				}
			}
			membershipDone = true;
			finish();
		});

		builtArea.issues = [];
		builtArea.delegations = [];
		builtArea.members = [];
		finish();
	});

}

exports.show = area;
