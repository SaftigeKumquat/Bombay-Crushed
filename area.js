var lf = require('./lfcli.js');
var issue = require('./issue.js');
var userFunc = require('./user.js');

var getMemberSupport = function(support, issue, ini) {
	for(var a = 0; a < support.length; a++) {
		if(support[a].length > 0 && support[a][0].issue_id == issue) {
			for(var b = 0; b < support[a].length; b++) {
				if(support[a][b].initiative_id == ini) {
					return true;
				}
			}
		}
	}
}

var area = function(state, render, page, memberpage) {
	var area_id = state.url.query.area_id;
	var builtArea = {};
	var issues = [];
	var policies = [];
	var interest = [];
	var inis = [];
	var members = [];
	var users = [];
	var support = [];
	var membershipDone = false;
	var issueDone = false;
	var finish = function() {
		if(builtArea.name && builtArea.unit
			&& membershipDone == true && issueDone == true
			&& interest.length == issues.length
			&& inis.length == issues.length
			&& members.length == users.length
			&& support.length == issues.length ) {

			builtArea.issues = [];
			builtArea.delegations = [];
			builtArea.members = [];

			var builtIssue = {};
			var quorum_num, quorum_den;

			var start_issue = 0;
			var end_issue = 6;
			if(page > 1) {
				start_issue = (page - 1) * 6;
				end_issue = page * 6;
			}

			var pages = Math.ceil(issues.length / 6);
			if(pages == 0) {
				pages = 1;
			}
			
			builtArea.issuespage = page;
			builtArea.issuespages = pages;

			var start_member = 0;
			var end_member = 24;
			if(memberpage > 1) {
				start_member = (memberpage - 1) * 24;
				end_member = memberpage * 24;
			}

			var memberpages = Math.ceil(members.length / 24);
			if(memberpages == 0) {
				memberpages = 1;
			}

			builtArea.memberspage = memberpage;
			builtArea.memberspages = memberpages;

			// only the first 6 issues
			for(var i = start_issue; i < issues.length && i < end_issue; i++) {

				builtIssue = {};
				builtIssue.id = issues[i].id;

				builtIssue.status = issue.getIssueStateText(issues[i].state);

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

						// bug fix: keep original table
						original_inis = inis[a];

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

						// TODO do something if no ini is admitted..
						if(inis[a][0] == undefined) {
							inis[a] = original_inis;
						}

						builtIssue.initiative_id = inis[a][0].id;
						builtIssue.title = inis[a][0].name;
						builtIssue.supporter = inis[a][0].satisfied_supporter_count;
						builtIssue.potsupporter = inis[a][0].supporter_count - inis[a][0].satisfied_supporter_count;
						builtIssue.uninterested = ( builtArea.membernumber - builtIssue.supporter ) - builtIssue.potsupporter;
						if(builtIssue.uninterested < 0) {
							builtIssue.uninterested = 0;
						}

						var total = builtIssue.supporter + builtIssue.potsupporter + builtIssue.uninterested;
						builtIssue.support = Math.floor(( builtIssue.supporter / total ) * 100);
						builtIssue.potential = Math.floor(( builtIssue.potsupporter / total ) * 100);
						builtIssue.uninvolved = Math.floor(( builtIssue.uninterested / total ) * 100);
						builtIssue.quorum = Math.floor(100 * quorum_num / quorum_den);

						// check if member supports ini
						if(getMemberSupport(support, builtIssue.id, inis[a][0].id)) {
							builtIssue.isupportini = true;
						}

						builtIssue.alternativeinis = [];

						for(var b = 1; b < inis[a].length; b++) {
							alternativeIni = {};

							alternativeIni.id = inis[a][b].id;
							alternativeIni.title = inis[a][b].name;
							alternativeIni.supporter = inis[a][b].satisfied_supporter_count;
							alternativeIni.potsupporter = inis[a][b].supporter_count - inis[a][b].satisfied_supporter_count;
							alternativeIni.uninterested = ( builtArea.membernumber - alternativeIni.supporter ) - alternativeIni.potsupporter;
							if(alternativeIni.uninterested < 0) {
								alternativeIni.uninterested = 0;
							}

							var total = alternativeIni.supporter + alternativeIni.potsupporter + alternativeIni.uninterested;
							alternativeIni.support = Math.floor(( alternativeIni.supporter / total ) * 100);
							alternativeIni.potential = Math.floor(( alternativeIni.potsupporter / total ) * 100);
							alternativeIni.uninvolved = Math.floor(( alternativeIni.uninterested / total ) * 100);

							// check if member supports ini
							if(getMemberSupport(support, builtIssue.id, inis[a][b].id)) {
								alternativeIni.isupportini = true;
							}

							builtIssue.alternativeinis.push(alternativeIni);
						}
					}
				}

				builtArea.issues.push(builtIssue);
			}


			// get members
			for(var i = start_member; i < members.length && i < end_member; i++) {
				var builtMember = {};
				for(var a = 0; a < users.length; a++) {
					if(users[a].id == members[i].member_id) {
						builtMember = userFunc.getUserBasic(users[a]);
					}
				}
				builtArea.members.push(builtMember);
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
		builtArea.id = res.result[0].id;
		builtArea.membernumber = res.result[0].member_weight;

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
					finish();
				});

				lf.query('/supporter', { 'issue_id': issue_id, 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(support_res) {
					support.push(support_res.result);
					finish();
				});

				policies.push(issue_res.policies[issue_res.result[i].policy_id]);
			}

			issueDone = true;
			finish();
		});

		lf.query('/membership', { 'area_id': area_id }, state, function(member_res) {
			for(var i = 0; i < member_res.result.length; i++) {
				members.push(member_res.result[i]);

				lf.query('/member', { 'member_id': member_res.result[i].member_id }, state, function(user_res) {
					users.push(user_res.result[0]);
					finish();
				});

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
