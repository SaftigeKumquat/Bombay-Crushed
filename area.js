var lf = require('./lfcli.js');
var issue = require('./issue.js');
var userFunc = require('./user.js');
var ejs = require('./ejs.js');
var logger = require('./logger.js');

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

var area = function(state, render, page, memberpage, my_involvment, issue_sort_criteria) {
	var area_id = state.url.query.area_id;
	var builtArea = {};
	var issues = [];
	var policies = [];
	var interest = [];
	var interest_by_issueid = {};
	var inis = [];
	var inis_by_issueid = {};
	var members = [];
	var users = [];
	var support = [];
	var membershipDone = false;
	var issueDone = false;
	var initiatorInfo;

	function max_total_supporters(issueid) {
		var inis = inis_by_issueid[issueid];
		var i;
		var max = 0;
		if(inis) {
			for(i = 0; i < inis.length; i++) {
				if(inis[i].supporter_count > max) {
					max = inis[i].supporter_count;
				}
			}
		}
		logger(4, 'Max total supporters for ' + issueid + ': ' + max);
		return max;
	}

	function max_supporters(issueid) {
		var inis = inis_by_issueid[issueid];
		var i;
		var max = 0;
		if(inis) {
			for(i = 0; i < inis.length; i++) {
				if(inis[i].supporter_count > max) {
					max = inis[i].satisfied_supporter_count;
				}
			}
		}
		logger(4, 'Max supporters for ' + issueid + ': ' + max);
		return max;
	}

	function find_initiator_info(issue_id) {
		var i_ini, i_info;
		var inis = inis_by_issueid[issue_id] || [];
		for(i_info = 0; i_info < initiatorInfo.length; i_info++) {
			for(i_ini = 0; i_ini < inis.length; i_ini++) {
				if(initiatorInfo[i_info].initiative_id === inis[i_ini].id) {
					return initiatorInfo[i_info];
				}
			}
		}
		return false;
	}

	function has_full_support_inis(issue_id) {
		var i_ini, a, b;
		var support_item;
		var inis = inis_by_issueid[issue_id] || [];
		for(a = 0; a < support.length; a++) {
			for(b = 0; b < support[a].length; b++) {
				for(i_ini = 0; i_ini < inis.length; i_ini++) {
					support_item = support[a][b];
					if(support_item.initiative_id === inis[i_ini].id && support_item.satisfied) {
						return true;
					}
				}
			}
		}
		return false;
	}

	function has_potential_support_inis(issue_id) {
		var i_ini, a, b;
		var support_item;
		var inis = inis_by_issueid[issue_id] || [];
		for(a = 0; a < support.length; a++) {
			for(b = 0; b < support[a].length; b++) {
				for(i_ini = 0; i_ini < inis.length; i_ini++) {
					support_item = support[a][b];
					if(support_item.initiative_id === inis[i_ini].id && ! support_item.satisfied) {
						return true;
					}
				}
			}
		}
		return false;
	}

	var finish = function() {
		var i, tmp_issue;

		if(builtArea.name && builtArea.unit
			&& membershipDone == true && issueDone == true
			&& interest.length == issues.length
			&& inis.length == issues.length
			&& members.length == users.length
			&& support.length == issues.length
			&& (my_involvment != '5' || initiatorInfo !== undefined)) {

			builtArea.issues = [];
			builtArea.delegations = [];
			builtArea.members = [];
			builtArea.delegationnumber = 0;

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

			// filter issues by given criteria
			var issue_involvment_filter;
			switch(my_involvment) {
				case '2':
					logger(2, 'Filtering by interest');
					logger(5, 'Interests: ' + JSON.stringify(interest_by_issueid));
					issue_involvment_filter = function(issue) {
						return interest_by_issueid[issue.id] || false;
					};
					break;
				case '3':
					logger(2, 'Filtering by full support');
					issue_involvment_filter = function(issue) {
						return has_full_support_inis(issue.id);
					}
					break;
				case '4':
					logger(2, 'Filtering by conditional support');
					issue_involvment_filter = function(issue) {
						return has_potential_support_inis(issue.id);
					}
					break;
				case '5':
					logger(2, 'Filtering by initiator');
					logger(5, 'Initiated: ' + JSON.stringify(initiatorInfo));
					issue_involvment_filter = function(issue) {
						return find_initiator_info(issue.id) !== false;
					};
					break;
				default:
					logger(2, 'Not filtering by involvment');
			}
			if(issue_involvment_filter) {
				issues = issues.filter(issue_involvment_filter);
			}

			// sort issues by given criteria
			var issue_sort_function;
			logger(2, 'issue sort criteria is ' + issue_sort_criteria);
			switch(issue_sort_criteria) {
				case '1':
					logger(2, 'sort by max potential supporters (includes actual)');
					issue_sort_function = function(a,b) {
						return max_total_supporters(b.id) - max_total_supporters(a.id);
					}
					break;
				case '2':
					logger(2, 'sort by satisfied supporters');
					issue_sort_function = function(a,b) {
						return max_supporters(b.id) - max_supporters(a.id);
					}
					break;
				case '3':
					logger(2, 'sorting highes population first');
					issue_sort_function = function(a,b) {
						return b.population - a.polulation;
					};
					break;
				case '4':
					logger(2, 'sorting newest issues first');
					issue_sort_function = function(a,b) {
						if (a.created < b.created)
							return 1;
						else if (a.created > b.created)
							return -1;
						else
							return 0;
					};
					break;
				case '5':
					logger(2, 'sorting oldest issues first');
					issue_sort_function = function(a,b) {
						if (a.created < b.created)
							return -1;
						else if (a.created > b.created)
							return 1;
						else
							return 0;
					};
			};
			if(issue_sort_function) {
				issues.sort(issue_sort_function);
			}
			state.context.selected_issue_sort_criteria = issue_sort_criteria;

			// only the first 6 issues
			for(i = start_issue; i < issues.length && i < end_issue; i++) {
				tmp_issue = issues[i];

				builtIssue = {};
				builtIssue.id = tmp_issue.id;

				builtIssue.status = issue.getIssueStateText(tmp_issue.state);

				builtIssue.iwatchissue = interest_by_issueid[builtIssue.id] || false;

				for(var a = 0; a < policies.length; a++) {
					if(policies[a].id == tmp_issue.policy_id) {
						quorum_num = policies[a].issue_quorum_num;
						quorum_den = policies[a].issue_quorum_den;
					}
				}

				inis_of_issue = inis_by_issueid[builtIssue.id];

				if(tmp_issue.ranks_available) {
					// only keep admitted inis
					admitted_inis = [];
					for(var b = 0; b < inis_of_issue.length; b++) {
						if(inis_of_issue[b].admitted) {
							admitted_inis.push(inis_of_issue[b])
						}
					}
					inis_of_issue = admitted_inis;

					// sort inis by rank
					Array.prototype.sort.call(inis_of_issue, function(a,b) {
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
					Array.prototype.sort.call(inis_of_issue, function(a,b) {
						if (a.satisfied_supporter_count > b.satisfied_supporter_count)
							return -1;
						else if (a.satisfied_supporter_count < b.satisfied_supporter_count)
							return 1;
						else
							return 0;
					});
				}

				// TODO do something if no ini is admitted..
				if(inis_of_issue[0] == undefined) {
					inis_of_issue = inis_by_issueid[builtIssue.id];
				}

				builtIssue.initiative_id = inis_of_issue[0].id;
				builtIssue.title = inis_of_issue[0].name;
				builtIssue.supporter = inis_of_issue[0].satisfied_supporter_count;
				builtIssue.potsupporter = inis_of_issue[0].supporter_count - inis_of_issue[0].satisfied_supporter_count;
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
				if(getMemberSupport(support, builtIssue.id, inis_of_issue[0].id)) {
					builtIssue.isupportini = true;
				}

				builtIssue.alternativeinis = [];

				for(var b = 1; b < inis_of_issue.length; b++) {
					alternativeIni = {};

					alternativeIni.id = inis_of_issue[b].id;
					alternativeIni.title = inis_of_issue[b].name;
					alternativeIni.supporter = inis_of_issue[b].satisfied_supporter_count;
					alternativeIni.potsupporter = inis_of_issue[b].supporter_count - inis_of_issue[b].satisfied_supporter_count;
					alternativeIni.uninterested = ( builtArea.membernumber - alternativeIni.supporter ) - alternativeIni.potsupporter;
					if(alternativeIni.uninterested < 0) {
						alternativeIni.uninterested = 0;
					}

					var total = alternativeIni.supporter + alternativeIni.potsupporter + alternativeIni.uninterested;
					alternativeIni.support = Math.floor(( alternativeIni.supporter / total ) * 100);
					alternativeIni.potential = Math.floor(( alternativeIni.potsupporter / total ) * 100);
					alternativeIni.uninvolved = Math.floor(( alternativeIni.uninterested / total ) * 100);

					// check if member supports ini
					if(getMemberSupport(support, builtIssue.id, inis_of_issue[b].id)) {
						alternativeIni.isupportini = true;
					}

					builtIssue.alternativeinis.push(alternativeIni);
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

	state.context.selected_my_involvment = my_involvment;

	// get the area
	lf.query('/area', { 'area_id': area_id, 'include_units': 1 }, state, function(res) {
		builtArea.name = res.result[0].name;
		builtArea.unit = res.units[res.result[0].unit_id].name;
		builtArea.id = res.result[0].id;
		builtArea.membernumber = res.result[0].member_weight;

		var issue_params = { 'area_id': area_id, 'include_policies': 1 };
		var issue_state = state.url.query.issue_state;
		if(issue_state && issue_state) {
			issue_params.issue_state = map_issue_states_to_lf(issue_state);
		}
		state.context.selected_issue_state = issue_state || '8';
		lf.query('/issue', issue_params, state, function(issue_res) {
			for(var i = 0; i < issue_res.result.length; i++) {
				issues.push(issue_res.result[i]);

				issue_id = issue_res.result[i].id;
				lf.query('/interest', { 'issue_id': issue_id, 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(interest_res) {
					if(interest_res.result.length > 0) {
						interest.push({ 'issue_id': interest_res.result[0].issue_id, 'iwatchissue': true});
						interest_by_issueid[interest_res.result[0].issue_id] = true;
					}
					else {
						interest.push({ 'issue_id': 0, 'iwatchissue': false});
					}
					finish();
				});

				lf.query('/initiative', { 'issue_id': issue_id }, state, function(ini_res) {
					inis.push(ini_res.result);
					if(ini_res.result.length > 0) {
						inis_by_issueid[ini_res.result[0].issue_id] = ini_res.result;
					}
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

		// if filtering by initiator also get initiator-info
		lf.query('/initiator', { 'area_id': area_id, 'member_id': state.user_id() }, state, function(initiator_res) {
			initiatorInfo = initiator_res.result;
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

function map_issue_states_to_lf(bc_state) {
	switch('' + bc_state) {
		case '1':
			return 'open';
		case '2':
			return 'admission';
		case '3':
			return 'discussion';
		case '4':
			return 'verification';
		case '5':
			return 'voting';
		case '6':
			return 'finished_without_winner,finished_with_winner'
		case '7':
			return 'canceled_revoked_before_accepted,canceled_issue_not_accepted,canceled_after_revocation_during_discussion,canceled_after_revocation_during_verification,canceled_no_initiative_admitted';
		case '8':
			return '';
		default:
			return 'open';
	}
}

exports.update_issues_table = function(state) {
	// we need an area id
	if(!state.url.query.area_id) {
		logger(1, 'Please provide area_id parameter');
		invalidURL(state);
		return;
	}

	// get page numbers
	var page = state.url.query.page || 1;
	var memberpage = state.url.query.memberpage || 1;
	var my_involvment = state.url.query.my_involvment || 1;
	var issue_sort_criteria = state.url.query.issue_sort_criteria || '4';

	var finish = function() {
		var ctx = state.context;
		if(ctx.area !== undefined) {
			ejs.render(state, '/area_issues_table.tpl', true);
		}
	}

	// TODO refactor to avoid querying members
	exports.show(state, finish, page, memberpage, my_involvment, issue_sort_criteria);
};

