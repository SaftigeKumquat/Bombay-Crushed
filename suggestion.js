var ejs = require('./ejs.js');
var lf = require('./lfcli.js');

/**
 * Takes care of retrieving data for and rendering the
 * suggestion page.
 *
 * @param state The state object of the current HTTP-Request
 */
exports.show = function(state) {
	// configuration stuff
	var OPINIONS_PER_PAGE = 4;

	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var suggestion_id = state.url.query.suggestion_id;

	// the variables to that will be set by the data retrievers
	// and if set the page will be rendered
	var suggestion_info, opinions_info, my_opinion_info, paging_info;

	var finish = function() {
		var ctx = state.context;

		if(suggestion_info !== undefined && opinions_info !== undefined && my_opinion_info !== undefined && paging_info !== undefined) {
			ctx.suggestion = suggestion_info;
			suggestion_info.opinions = opinions_info;
			suggestion_info.isayimplemented = my_opinion_info.i_say_implemented;
			suggestion_info.smiley = my_opinion_info.smiley;
			suggestion_info.my_opinion = my_opinion_info.opinion;
			suggestion_info.opinionpage = paging_info.opinionpage;
			suggestion_info.opinionpages = paging_info.opinionpages;

			ctx.meta.currentpage = "suggestion";
			ejs.render(state, '/suggestion.tpl');
		}
	}

	// get the initiative
	lf.query('/suggestion', { 'suggestion_id': suggestion_id, 'include_initiatives': true }, state, function(res) {
		console.log(JSON.stringify(res));
		var suggestion_res = res.result[0];
		console.log('SUGGESTION: ' + JSON.stringify(suggestion_res));
		var initiative = res.initiatives[suggestion_res.initiative_id];
		console.log('INITIATIVE: ' + JSON.stringify(initiative));

		var total_supporters = initiative.supporter_count;

		var tmp_suggestion = {
			initiative: {
				name: initiative.name
			},
			name: suggestion_res.name,
			text: suggestion_res.content,

			mustsupporter: suggestion_res.plus2_unfulfilled_count + suggestion_res.plus2_fulfilled_count,
			shouldsupporter: suggestion_res.plus1_unfulfilled_count + suggestion_res.plus1_fulfilled_count,
			neutralsupporter: total_supporters
			                  - (suggestion_res.plus2_unfulfilled_count + suggestion_res.plus2_fulfilled_count)
			                  - (suggestion_res.plus1_unfulfilled_count + suggestion_res.plus1_fulfilled_count)
			                  - (suggestion_res.minus2_unfulfilled_count + suggestion_res.minus2_fulfilled_count)
			                  - (suggestion_res.minus1_unfulfilled_count + suggestion_res.minus1_fulfilled_count),
			shouldnotsupporter: suggestion_res.minus1_unfulfilled_count + suggestion_res.minus1_fulfilled_count,
			mustnotsupporter: suggestion_res.minus2_unfulfilled_count + suggestion_res.minus2_fulfilled_count,

			notimplementedmustsupporter: suggestion_res.plus2_unfulfilled_count,
			notimplementedshouldsupporter: suggestion_res.plus1_unfulfilled_count,
			notimplementedshouldnotsupporter: suggestion_res.minus1_unfulfilled_count,
			notimplementedmustnotsupporter: suggestion_res.minus2_unfulfilled_count,

			implementedmustsupporter: suggestion_res.plus2_fulfilled_count,
			implementedshouldsupporter: suggestion_res.plus1_fulfilled_count,
			implementedshouldnotsupporter: suggestion_res.minus1_fulfilled_count,
			implementedmustnotsupporter: suggestion_res.minus2_fulfilled_count,
		};
		notimplementedneutralsupporter = tmp_suggestion.neutralsupporter;
		implementedneutralsupporter = tmp_suggestion.neutralsupporter;

		tmp_suggestion.mustsupportwidth = tmp_suggestion.mustsupporter * 100 / total_supporters + "%";
		tmp_suggestion.shouldsupportwidth = tmp_suggestion.shouldsupporter * 100 / total_supporters + "%";
		tmp_suggestion.neutralsupportwidth = tmp_suggestion.neutralsupporter * 100 / total_supporters + "%";
		tmp_suggestion.shouldnotsupportwidth = tmp_suggestion.shouldnotsupporter * 100 / total_supporters + "%";
		tmp_suggestion.mustnotsupportwidth = tmp_suggestion.mustnotsupporter * 100 / total_supporters + "%";

		tmp_suggestion.notimplementedmustsupportwidth = tmp_suggestion.notimplementedmustsupporter * 100 / total_supporters + "%";
		tmp_suggestion.notimplementedshouldsupportwidth = tmp_suggestion.notimplementedshouldsupporter * 100 / total_supporters + "%";
		tmp_suggestion.notimplementedneutralsupportwidth = tmp_suggestion.notimplementedneutralsupporter * 100 / total_supporters + "%";
		tmp_suggestion.notimplementedshouldnotsupportwidth = tmp_suggestion.notimplementedshouldnotsupporter * 100 / total_supporters + "%";
		tmp_suggestion.notimplementedmustnotsupportwidth = tmp_suggestion.notimplementedmustnotsupporter * 100 / total_supporters + "%";
		tmp_suggestion.implementedmustsupportwidth = tmp_suggestion.notimplementedmustsupporter * 100 / total_supporters + "%";
		tmp_suggestion.implementedshouldsupportwidth = tmp_suggestion.notimplementedshouldsupporter * 100 / total_supporters + "%";
		tmp_suggestion.implementedneutralsupportwidth = tmp_suggestion.notimplementedneutralsupporter * 100 / total_supporters + "%";
		tmp_suggestion.implementedshouldnotsupportwidth = tmp_suggestion.notimplementedshouldnotsupporter * 100 / total_supporters + "%";
		tmp_suggestion.implementedmustnotsupportwidth = tmp_suggestion.notimplementedmustnotsupporter * 100 / total_supporters + "%";

		// add author info
		lf.query('/member', { 'member_id': suggestion_res.author_id }, state, function(res) {
			var author = res.result[0];
			console.log("AUTHOR: " + JSON.stringify(author));

			tmp_suggestion.author = {
				nick: author.name,
				name: author.realname || author.name,
				picsmall: "avatar/" + author.id,
				picmini: "picbig/" + author.id
			}

			suggestion_info = tmp_suggestion;
			finish();
		});
	});

	lf.query('/opinion', { 'suggestion_id': suggestion_id }, state, function(res) {
		var lf_opinions = res.result;

		/**
		 * Calculate the hapiness smiley for the given opinion.
		 * Result is 1 for very happy, 4 for very unhappy
		 */
		var calculate_smiley = function(lf_opinion) {
			var smiley = 1; // if degree == 0 we don't care, so we are happy
			if(lf_opinion.degree !== 0) {
				// renormalize (map to 0...4 and then to 1...4)
				smiley = lf_opinion.degree + 2;
				if(smiley < 2) {
					smiley += 2;
				}
				// if fullfilled highest value is happy
				if(lf_opinion.fulfilled) {
					smiley = 5 - smiley;
				}
			}
			return smiley;
		}

		console.log('OPINIONS:' + JSON.stringify(res));
		tmp_my_opinion = {
			i_say_implemented: false,
			smiley: 1,
			opinion: 0
		};
		var members_to_resolve = '';

		paging_info = function() {
			var tmp = {
				opinionpages: Math.floor(lf_opinions.length / OPINIONS_PER_PAGE) + 1,
				opinionpage: state.url.query.opinionpage || 1
			}
			if(tmp.opinionpage < 1 || tmp.opinionpage > tmp.opinionpages) {
				console.log('WARNING: Opinion page ' + tmp.opinionpage + ' requested, but only pages 1 to ' + tmp.opinionpages + ' valid for suggestion ' + suggestion_id);
				tmp.opinionpage = 1;
			}
			return tmp;
		}();
		console.log('PAGING INFO ' + JSON.stringify(paging_info));

		for(var i = OPINIONS_PER_PAGE * (paging_info.opinionpage - 1); i < lf_opinions.length && i < OPINIONS_PER_PAGE * (paging_info.opinionpage); i++) {
			var lf_opinion = lf_opinions[i];
			if(lf_opinion.member_id == state.user_id()) {
				tmp_my_opinion.i_say_implemented = lf_opinion.fulfilled;
				tmp_my_opinion.smiley = calculate_smiley(lf_opinion);
				tmp_my_opinion.opinion = lf_opinion.degree;
			}

			if(members_to_resolve != '') {
				members_to_resolve += ',';
			}
			members_to_resolve += lf_opinion.member_id;
		}
		my_opinion_info = tmp_my_opinion;

		lf.query('/member', { 'member_id': members_to_resolve }, state, function(res) {
			var i;
			var lf_member;
			var lf_members = res.result;
			var lf_members_by_id = {};
			for(i = 0; i < lf_members.length; i++) {
				lf_member = lf_members[i];
				lf_members_by_id[lf_member.id] = lf_member;
			}

			var tmp_opinion;
			var tmp_opinions = [];

			var calculate_action = function(lf_opinion) {
				switch(lf_opinion.degree) {
					case -2:
					case -1:
						return 'against';
					case 1:
					case 2:
						return 'for';
					default:
						return '';
				}
			};

		for(var i = OPINIONS_PER_PAGE * (paging_info.opinionpage - 1); i < lf_opinions.length && i < OPINIONS_PER_PAGE * (paging_info.opinionpage); i++) {
				lf_opinion = lf_opinions[i];
				// filter own opinion
				if(lf_opinion.member_id != state.user_id()) {
					console.log('LF OPINION: ' + JSON.stringify(lf_opinion));
					lf_member = lf_members_by_id[lf_opinion.member_id];
					console.log('LF member: ' + JSON.stringify(lf_member));
					tmp_opinion = {
						user: {
							nick: lf_member.name,
							name: lf_member.realname,
							picsmall: 'avatar/' + lf_member.id,
							picmini: 'avatar/' + lf_member.id
						},
						action: calculate_action(lf_opinion),
						implemented: lf_opinion.fulfilled,
						smiley: calculate_smiley(lf_opinion)
					}
					tmp_opinions.push(tmp_opinion);
				}
			}
			opinions_info = tmp_opinions;

			finish();
		});
	});
}
