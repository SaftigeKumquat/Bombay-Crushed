var lf = require('./lfcli.js');
var texts = require('./texts.json');

var area = function(state, render) {
	var area_id = state.url.query.area_id;
	var builtArea = {};
	var issues = [];
	var policies = [];
	var interest = [];
	var inis = [];
	var membershipDone = false;
	var issueDone = false;
	var finish = function() {
		if(builtArea.name && builtArea.unit
			&& membershipDone == true && issueDone == true
			&& interest.length == issues.length
			&& inis.length == issues.length ) {

			builtArea.issues = [];			
			builtArea.delegations = [];
			builtArea.members = [];

			var builtIssue = {};
			var quorum_num, quorum_den;
			
			// only the first 6 issues
			for(var i = 0; i < issues.length && i < 6; i++) {

				builtIssue = {};
				builtIssue.id = issues[i].id;

				switch(issues[i].state) {
					case "calculation":
					case "finished_with_winner":
					case "finished_without_winner":
						builtIssue.status = texts.statusstep5;
						break;
					case "verification":
						builtIssue.status = texts.statusstep3;
						break;
					case "voting":
						builtIssue.status = texts.statusstep4;
						break;
					case "discussion":
						builtIssue.status = texts.statusstep2;
						break;
					case "admission":
						builtIssue.status = texts.statusstep1;
						break;
					case "canceled_revoked_before_accepted":
					case "canceled_issue_not_accepted":
					case "canceled_after_revocation_during_discussion":
					case "canceled_after_revocation_during_verification":
					case "canceled_no_initiative_admitted":
						builtIssue.status = texts.statusstep6;
						break;
				}

				for(var a = 0; a < interest.length; a++) {
					if(interest[a].issue_id == builtIssue.id && interest[a].iwatchissue == true) {
						builtIssue.iwatchissue = true;
					}
				}

				for(var a = 0; a < policies.length; a++) {
					if(policies[a].id == issues[i].policy_id) {
						quorum_num = policies[a].issue_quorum_num;
						quorum_den = policies[a].issue_quorum_den;
					}
				}

				for(var a = 0; a < inis.length; a++) {
					if(inis[a][0].issue_id == builtIssue.id) {

						if(issues[i].ranks_available) {
							// only keep admitted inis
							admitted_inis = [];
							for(var b = 0; b < inis[a].length; b++) {
								if(inis[a][b].admitted) {
									admitted_inis.push(inis[a][b])
								}
							}
							inis[a] = admitted_inis;

							// sort inis by rank
							Array.prototype.sort.call(inis[a], function(a,b) {
    								if (a.rank < b.rank)
        								return -1;
    								else if (a.rank > b.rank)
        								return 1;
    								else 
        								return 0;
							});
						}
						else {
							// sort inis by supporter
							Array.prototype.sort.call(inis[a], function(a,b) {
    								if (a.satisfied_supporter_count > b.satisfied_supporter_count)
        								return -1;
    								else if (a.satisfied_supporter_count < b.satisfied_supporter_count)
        								return 1;
    								else 
        								return 0;
							});
						}

						builtIssue.title = inis[a][0].name;						
						builtIssue.supporter = inis[a][0].satisfied_supporter_count;
						builtIssue.potsupporter = inis[a][0].supporter_count - inis[a][0].satisfied_supporter_count;
						builtIssue.uninterested = ( builtArea.member_weight - builtIssue.supporter ) - builtIssue.potsupporter;
						if(builtIssue.uninterested < 0) {
							builtIssue.uninterested = 0;
						}

						var total = builtIssue.supporter + builtIssue.potsupporter + builtIssue.uninterested;
						builtIssue.support = Math.floor(( builtIssue.supporter / total ) * 100);
						builtIssue.potential = Math.floor(( builtIssue.potsupporter / total ) * 100);
						builtIssue.uninvolved = Math.floor(( builtIssue.uninterested / total ) * 100);
						builtIssue.quorum = Math.floor(total * quorum_num / quorum_den);

						builtIssue.alternativeinis = [];

						for(var b = 1; b < inis[a].length; b++) {
							alternativeIni = {};

							alternativeIni.title = inis[a][b].name;						
							alternativeIni.supporter = inis[a][b].satisfied_supporter_count;
							alternativeIni.potsupporter = inis[a][b].supporter_count - inis[a][b].satisfied_supporter_count;
							alternativeIni.uninterested = ( builtArea.member_weight - alternativeIni.supporter ) - alternativeIni.potsupporter;
							if(alternativeIni.uninterested < 0) {
								alternativeIni.uninterested = 0;
							}

							var total = alternativeIni.supporter + alternativeIni.potsupporter + alternativeIni.uninterested;
							alternativeIni.support = Math.floor(( alternativeIni.supporter / total ) * 100);
							alternativeIni.potential = Math.floor(( alternativeIni.potsupporter / total ) * 100);
							alternativeIni.uninvolved = Math.floor(( alternativeIni.uninterested / total ) * 100);

							console.log('ALT:' + JSON.stringify(alternativeIni));
							builtIssue.alternativeinis.push(alternativeIni);
						}
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
		builtArea.member_weight = res.result[0].member_weight;

		lf.query('/issue', { 'area_id': area_id, 'include_policies': 1 }, state, function(issue_res) {
			for(var i = 0; i < issue_res.result.length; i++) {
				issues.push(issue_res.result[i]);

				issue_id = issue_res.result[i].id;
				lf.query('/interest', { 'issue_id': issue_id, 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(interest_res) {
					if(interest_res.result.length > 0) {
						interest.push({ 'issue_id': interest_res.result[0].issue_id, 'iwatchissue': true});
					}
					else {
						interest.push({ 'issue_id': 0, 'iwatchissue': false});
					}
					finish();
				});

				lf.query('/initiative', { 'issue_id': issue_id }, state, function(ini_res) {
					inis.push(ini_res.result);

					// TODO: support
					finish();
				});

				policies.push(issue_res.policies[issue_res.result[i].policy_id]);
			}			

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

		finish();
	});

}

exports.show = area;
