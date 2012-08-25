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

	// the variables that will be set by the data retrievers
	// If they are finally filled with data the page will be rendered
	var issue_info, initiatives_info, castvote_info, members_info;

	var finish = function() {
		var ctx = state.context;

		if(issue_info !== undefined && initiatives_info !== undefined &&
				castvote_info !== undefined && members_info !== undefined)
		{
			ctx.issue = issue_info;
			issue_info.initiatives = initiatives_info;
			issue_info.castvote = castvote_info;
			//TODO (api funcitonality missing)
			issue_info.delegations = [];
			issue_info.members = members_info;

			ctx.meta.currentpage = "issue";
			ejs.render(state, '/issue.tpl');
		}
	}

	//get issue
	lf.query('/issue', { 'issue_id': issue_id, 'include_units': 1, 'include_policies': 1, 'include_areas': 1 }, state, function(res)
		{
			//TODO handle empty result
			var issue_res = res.result[0];
			//fill directly available issue information
			var tmp_issue_info = {
				id: issue_id,
				population: issue_res.population,
				createdat: issue_res.created,
				acceptedat: issue_res.accepted,
				halffrozenat: issue_res.half_frozen,
				frozenat: issue_res.fully_frozen,
				timeforadmission: issue_res.admission_time.days,
				timefordiscussion: issue_res.discussion_time.days,
				timeforrevision: issue_res.verification_time.days,
				timeforvote: issue_res.voting_time.days,
				status: getIssueState(issue_res.state),
				"iwatchissue": false, //default value, may become true later
				
				//TODO
				"delegationnumber": 200,
				/*"delegate": { "name": "Christoph Fritzsche",
						"picsmall": "content_img/profile_delegate_1.png" },*/
				"pagination": {
					"currentdelegations": 1,
					"totaldelegations": 2,
					"currentinterested": 2,
					"totalinterested": 2
				}

			};

			//fill undefined values
			if(tmp_issue_info.acceptedat === null){
				tmp_issue_info.acceptedat = '-';
			}
			if(tmp_issue_info.halffrozenat === null){
				tmp_issue_info.halffrozenat = '-';
			}
			if(tmp_issue_info.frozenat === null){
				tmp_issue_info.frozenat = '-';
			}

			tmp_issue_info.quorum = res.policies[issue_res.policy_id].issue_quorum_num;
			if(issue_res.closed === undefined) {
				tmp_issue_info.open = true;
			}
			else {
				tmp_issue_info.open = false;
			}

			tmp_issue_info.area = res.areas[issue_res.area_id].name;
			tmp_issue_info.unit = res.units[res.areas[issue_res.area_id].unit_id].name;
			// member_weight can be wrong at the moment. API bug is known.
			tmp_issue_info.areamembernumber = res.areas[issue_res.area_id].member_weight;

			//get info if vote is cast already
			lf.query('/voter', {'issue_id': issue_id, 'member_id': state.user_id()}, state, function(res) {
				if(res.result.length>0){
					castvote_info = true;
				}
				else {
					castvote_info = false;
				}
				finish();
			});

			//get information about interested members
			lf.query('/interest', {'issue_id': issue_id, 'snapshot': 'latest'}, state, function(res) {
				var tmp_members_info = [];
				for(var i = 0; i < res.result.length; i++) {
					if(res.result[i].member_id == state.user_id()) {
						tmp_issue_info.iwatchissue = true;
					}
				}

				members_info = tmp_members_info;
				finish();
			});

			//get initiatives
			lf.query('/initiative', {'issue_id': issue_id}, state, function(res) {
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

					// if uninterested is negative (API bug), set it to 0
					if(tmp_initiative.uninterested < 0) {
						tmp_initiative.uninterested = 0;
					} 

					var total = tmp_initiative.supporter + tmp_initiative.potsupporter + tmp_initiative.uninterested;
					tmp_initiative.support = Math.floor(( tmp_initiative.supporter / total ) * 100);
					tmp_initiative.potential = Math.floor(( tmp_initiative.potsupporter / total ) * 100);
					tmp_initiative.uninvolved = Math.floor(( tmp_initiative.uninterested / total ) * 100);

					tmp_initiatives_info.push(tmp_initiative);
				}

				//add isupportini information
				lf.query('/supporter', { 'initiative_id': tmp_ini_ids.toString(), 'snapshot': 'latest', 'member_id': state.user_id() }, state, function(res) {
					var supported_inis = [];
					for(var j=0; j < res.result.length; j++) {
						//TODO is a check for informed needed?
						//if(res.result[j].informed == true) {
						supported_inis.push(res.result[j].initiative_id);
						//}
					}

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
