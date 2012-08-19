var ejs = require('./ejs.js');
var lf = require('./lfcli.js');
var texts = require('./texts.json');
var issueFunc = require('./issue.js');
var userFunc = require('./user.js');

/**
 * Basic functions on JS objects
 */
var registerFunctions = function() {
	Array.prototype.contains = function(obj) {
    		for (var i = 0; i < this.length; i++) {
        		if (this[i] === obj) {
            			return true;
        		}
    		}
    		return false;
	}
}

/**
 * Takes care of retrieving data for and rendering the
 * initiative page.
 *
 * @param state The state object of the current HTTP-Request
 */
exports.show = function(state, render) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	// we need an initiative id
	if(!state.url.query.initiative_id) {
		state.fail_invalidResource('Please provide initiative_id parameter');
		return;
	}

	registerFunctions();

	var initiative_id = state.url.query.initiative_id;
	var builtIni = {};
	var initiative;
	var issue;
	var area;
	var unit;
	var policy;
	var drafts = [];
	var authors = [];
	var supporters = [];
	var current_draft;
	var iniDone = false;
	var draftDone = false;
	var supportDone = false;

	var finish = function() {
		if(iniDone && draftDone && supportDone
			&& drafts.length == authors.length) {

			builtIni.id = initiative_id;
			builtIni.name = initiative.name;
			builtIni.area = {};
			builtIni.area.id = area.id;
			builtIni.area.name = area.name;
			builtIni.issue = {};
			builtIni.issue.id = issue.id;
			builtIni.policy = policy.name;
			builtIni.text = current_draft.content;
			builtIni.state = issueFunc.getIssueStateText(issue.state);

			var date = new Date(initiative.created);
			builtIni.createdat = date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
			
			// calculate quorum
			quorum_num = policy.issue_quorum_num;
			quorum_den = policy.issue_quorum_den;
			builtIni.requiredquorum = (quorum_num / quorum_den * 100) + '%';
			builtIni.requiredrightnow = Math.ceil(quorum_num / quorum_den * (area.member_weight));

			if(initiative.admitted) {
				builtIni.admitted = texts.yes;
			}
			else {
				builtIni.admitted = texts.no;
			}

			// get authors
			var author_ids = [];
			builtIni.authors = [];
			for(var i = 0; i < authors.length; i++) {
				builtAuthor = {};
				if(!author_ids.contains(authors[i].id)) {
					author_ids.push(authors[i].id);

					builtAuthor = userFunc.getUserBasic(authors[i]);

					if(builtAuthor.id == current_draft.author_id) {
						builtAuthor.lastauthor = true;
					}

					builtIni.authors.push(builtAuthor);
				}
			}

			builtIni.drafts = [];
			// sort drafts by date
			Array.prototype.sort.call(drafts, function(a,b) {
    				if (a.created > b.created)
        				return -1;
    				else if (a.created < b.created)
        				return 1;
    				else 
        				return 0;
			});

			// build drafts
			for(var i = 0; i < drafts.length; i++) {
				builtDraft = {};
				builtDraft.id = drafts[i].id;

				var date = new Date(drafts[i].created);
				builtDraft.createdat = date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
			
				builtDraft.author = {};
				// get author
				for(var a = 0; a < authors.length; a++) {
					if(authors[a].id == drafts[i].author_id) {
						builtDraft.author = userFunc.getUserBasic(authors[a]);
					}
				}

				builtIni.drafts.push(builtDraft);
			}

			builtIni.supporters = [];
			supporternumber = 0;
			potsupporternumber = 0;

			var supporterpages = Math.ceil(supporters.length / 24);
			builtIni.supporterspages = supporterpages;
			builtIni.supporterspage = 1;

			var start_support = 0;
			var end_support = 24;

			if(state.url.query.supporterpage !== undefined && state.url.query.supporterpage > 1) {
				start_support = (state.url.query.supporterpage - 1) * 24;
				end_support = state.url.query.supporterpage * 24;
				builtIni.supporterspage = state.url.query.supporterpage;
			}

			// get supporters
			for(var i = 0; i < supporters.length; i++) {
				builtMember = userFunc.getUserBasic(supporters[i].member);

				// limit to 24
				if(i >= start_support && i < end_support) {
					builtIni.supporters.push(builtMember);
				}

				if(supporters[i].member.id == state.user_id()) {
					builtIni.isupport = true;
				}
				
				if(supporters[i].supporter.satisfied) {
					supporternumber++;
				}
				else {
					potsupporternumber++;
				}
			}
			builtIni.supporter = supporternumber;
			builtIni.potsupporter = potsupporternumber;

			builtIni.suggestions = [];
			builtIni.alternativeinis = [];
			
			state.context.initiative = builtIni;

			state.context.meta.currentpage = "initiative";
			ejs.render(state, '/initiative.tpl');
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

	// get drafts
	lf.query('/draft', { 'initiative_id': initiative_id, 'render_content': 'html' }, state, function(draft_res) {
		var highest_id = 0;
		for(var i = 0; i < draft_res.result.length; i++) {
			drafts.push(draft_res.result[i]);
			if(draft_res.result[i].id > highest_id) {
				highest_id = draft_res.result[i].id;
				current_draft = draft_res.result[i];
			}

			// get authors
			lf.query('/member', { 'member_id': draft_res.result[i].author_id }, state, function(member_res) {
				authors.push(member_res.result[0]);
				finish();
			});
		}
		
		draftDone = true;
		finish();
	});

	// get supporters
	lf.query('/supporter', { 'initiative_id': initiative_id, 'snapshot': 'latest', 'include_members': 1 }, state, function(support_res) {
		for(var i = 0; i < support_res.result.length; i++) {
			fetchedSupporter = {
				"supporter": support_res.result[i],
				"member": support_res.members[support_res.result[i].member_id]
			};
			supporters.push(fetchedSupporter);
		} 

		supportDone = true;
		finish();
	});
}
