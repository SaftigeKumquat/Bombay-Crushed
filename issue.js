var texts = require('./texts.json');
var lf = require('./lfcli.js');
var ejs = require('./ejs.js');


/**
 * Returns the readable text for an API issue state
 *
 * @param issuestate Issue state as provided by the API
 */
getIssueStateText = function (issuestate) {
	switch(issuestate) {
		case "calculation":
		case "finished_with_winner":
		case "finished_without_winner":
			return texts.statusstep5;
			break;
		case "verification":
			return texts.statusstep3;
			break;
		case "voting":
			return texts.statusstep4;
			break;
		case "discussion":
			return texts.statusstep2;
			break;
		case "admission":
			return texts.statusstep1;
			break;
		case "canceled_revoked_before_accepted":
		case "canceled_issue_not_accepted":
		case "canceled_after_revocation_during_discussion":
		case "canceled_after_revocation_during_verification":
		case "canceled_no_initiative_admitted":
			return texts.statusstep6;
			break;
	}
}


/**
 * Returns the API issue state
 *
 * @param issuestate Issue state as provided by the API
 */
getIssueState = function (issuestate) {
	switch(issuestate) {
		case "calculation":
		case "finished_with_winner":
		case "finished_without_winner":
			return texts.status5;
			break;
		case "verification":
			return texts.status3;
			break;
		case "voting":
			return texts.status4;
			break;
		case "discussion":
			return texts.status2;
			break;
		case "admission":
			return texts.status1;
			break;
		case "canceled_revoked_before_accepted":
		case "canceled_issue_not_accepted":
		case "canceled_after_revocation_during_discussion":
		case "canceled_after_revocation_during_verification":
		case "canceled_no_initiative_admitted":
			return texts.status6;
			break;
	}
}

/**
 * Takes care of retrieving data for and rendering the
 * issue page.
 *
 * @param state The state object of the current HTTP-Request
 */
exports.show = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var issue_id = state.url.query.issue_id;

	// the variables to that will be set by the data retrievers
	// and if set the page will be rendered
	var issue_info, initiatives_info;

	var finish = function() {
		var ctx = state.context;

		if(issue_info !== undefined && initiatives_info !== undefined) {
			ctx.issue = issue_info;
			issue_info.initiatives = initiatives_info;
			//TODO
			issue_info.delegations = [];
			//TODO
			issue_info.members = [];

			ctx.meta.currentpage = "issue";
			ejs.render(state, '/issue.tpl');
		}
	}

	//get issue
	//issue_id=1&include_areas=1&include_units=1&include_policies=1
	lf.query('/issue', { 'issue_id': issue_id, 'include_units': 1, 'include_policies': 1 }, state, function(res)
		{
			//console.log(JSON.stringify(res));
			//TODO handle empty result
			var issue_res = res.result[0];
			//fill directly available issue information
			var tmp_issue_info = {
				id: issue_id,
				population: issue_res.population,
				createdat: issue_res.created,
				accepted: issue_res.accepted,
				halffrozenat: issue_res.half_frozen,
				frozenat: issue_res.fully_frozen,
				timeforadmission: issue_res.admission_time,
				timefordiscussion: issue_res.discussion_time,
				timeforrevision: issue_res.verification_time,
				timeforvote: issue_res.voting_time,
				status: getIssueState(issue_res.state),
				
				//TODO
				"castvote": false,
				"delegationnumber": 200,
				"delegate": "Christoph Fritzsche",
				"iwatchissue": true,
				//postpone is not available in the API (maybe completely missing in LQFB 2.0?)
				//"iwanttopostponeissue": true,
				"pagination": {
					//"currentpostponers": 1,
					//"totalpostponers": 2,
					"currentdelegations": 1,
					"totaldelegations": 2,
					"currentinterested": 2,
					"totalinterested": 2
				}
				// /TODO
//{"result":[{"policy_id":1,"closed":"2011-10-30T17:34:37.901Z","ranks_available":true,"cleaned":null,"voter_count":0,"status_quo_schulze_rank":1}],"units":{},"policies":{"1":{"id":1,"index":1,"active":true,"name":"amendment of the statutes (solar system)","admission_time":{"days":8},"discussion_time":{"days":15},"verification_time":{"days":8},"voting_time":{"days":15},"issue_quorum_num":10,"issue_quorum_den":100,"initiative_quorum_num":10,"initiative_quorum_den":100,"direct_majority_num":1,"direct_majority_den":2,"direct_majority_strict":true,"direct_majority_positive":0,"direct_majority_non_negative":0,"indirect_majority_num":2,"indirect_majority_den":3,"indirect_majority_strict":false,"indirect_majority_positive":0,"indirect_majority_non_negative":0,"no_reverse_beat_path":true,"no_multistage_majority":false}},"status":"ok"}

			};

			tmp_issue_info.quorum = res.policies[issue_res.policy_id].issue_quorum_num;
			if(issue_res.closed === undefined) {
				tmp_issue_info.open = true;
			}
			else {
				tmp_issue_info.open = false;
			}

			lf.query('/area', { 'area_id': issue_res.area_id, 'include_units': 1 }, state, function(res) {
				tmp_issue_info.area = res.result[0].name;
				tmp_issue_info.unit = res.units[res.result[0].unit_id].name;
				tmp_issue_info.areamembernumber = res.result[0].member_weight;
			});

			//get initiatives
			lf.query('/initiative', {'issue_id': issue_id, }, state, function(res) {
				var tmp_initiatives_info = [];
				var tmp_ini_ids = [];
				for(var i = 0; i < res.result.length; i++) {
					tmp_ini_ids.push(res.result[i].id);
					var tmp_initiative = {
						name: res.result[i].name,
						supporter: res.result[i].satisfied_supporter_count,
						id: res.result[i].id
					}

					tmp_initiative.potsupporter = (res.result[i].supporter_count - res.result[i].satisfied_supporter_count);
					tmp_initiative.uninterested = (tmp_issue_info.areamembernumber - tmp_initiative.supporter ) - tmp_initiative.potsupporter;
					var total = tmp_initiative.supporter + tmp_initiative.potsupporter + tmp_initiative.uninterested;
					tmp_initiative.support = Math.floor(( tmp_initiative.supporter / total ) * 100);
					tmp_initiative.potential = Math.floor(( tmp_initiative.potsupporter / total ) * 100);
					tmp_initiative.uninvolved = Math.floor(( tmp_initiative.uninterested / total ) * 100);

					tmp_initiatives_info.push(tmp_initiative);
				}

				//add isupportini information
				lf.query('/supporter', { 'initiative_id': tmp_ini_ids.toString(), 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(res) {
					var supported_inis = [];
					console.log("SUPPORTER RES: " + JSON.stringify(res));
					for(var j=0; j < res.result.length; j++) {
						//TODO is a check for informed needed?
						//if(res.result[j].informed == true) {
						supported_inis.push(res.result[j].initiative_id);
						//}
					}
					console.log("SUPPORTED INI IDs: " + supported_inis.toString());

					for(var i=0; i < tmp_initiatives_info.length; i++) {
						if(supported_inis.length==0) {
							tmp_initiatives_info[i].isupportini = false;
							continue;
						}
						for(var j=0; j<supported_inis.length; j++)
							if(tmp_initiatives_info[i].id == supported_inis[j]) {
								tmp_initiatives_info[i].isupportini = true;
								}
							else {
								tmp_initiatives_info[i].isupportini = false;
							}
					}
					initiatives_info = tmp_initiatives_info;
					finish();
				});
			});
			issue_info = tmp_issue_info;
			finish();
	});
}


exports.getIssueStateText = getIssueStateText;
