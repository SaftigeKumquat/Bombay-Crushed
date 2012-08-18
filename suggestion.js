var ejs = require('./ejs.js');
var lf = require('./lfcli.js');

/**
 * Takes care of retrieving data for and rendering the
 * suggestion page.
 *
 * @param state The state object of the current HTTP-Request
 */
exports.show = function(state) {
	// we need a valid user session...
	if(!state.session_key()) {
		state.sendToLogin();
		return;
	}

	var suggestion_id = state.url.query.suggestion_id;

	// the variables to that will be set by the data retrievers
	// and if set the page will be rendered
	var suggestion_info, opinions_info, my_opinion_info;

	var finish = function() {
		var ctx = state.context;

		if(suggestion_info !== undefined && opinions_info !== undefined && my_opinion_info !== undefined) {
			ctx.suggestion = suggestion_info;
			suggestion_info.opinions = opinions_info;
			suggestion_info.isayimplemented = my_opinion_info.i_say_implemented;
			suggestion_info.smiley = my_opinion_info.smiley;

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
					simley += 2;
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
			smiley: 1
		};
		var members_to_resolve = '';

		// TODO handle opinion-pages

		for(var i = 0; i < res.result.length; i++) {
			var lf_opinion = res.result[i];
			if(lf_opinion.member_id == state.user_id()) {
				tmp_my_opinion.i_say_implemented = lf_opinion.fulfilled;
				tmp_my_opinion.smiley = calculate_smiley(lf_opinion);
			}

			if(members_to_resolve != '') {
				members_to_resolve += ',';
			}
			members_to_resolve += lf_opinion.member_id;
		}
		my_opinion_info = tmp_my_opinion;

		lf.query('/member', { 'member_id': members_to_resolve }, state, function(res) {
			console.log('MEMBERS:' + JSON.stringify(res));
			opinions_info = []; // TODO
			// format:
			//, "opinions": [
			//			{ "user": { "nick": "joknopp", "name": "Johannes Knopp", "picsmall": "content_img/profile_delegate_3.png", "picmini": "content_img/profile_small.png" }, "action": "for",
			//				"implemented": true, "smiley": 1 },
			//			{ "user": { "nick": "incredibul", "name": "Christophe Chan Hin", "picsmall": "content_img/profile_delegate_2.png", "picmini": "content_img/profile_small.png" }, "action": "against",
			//				"implemented": false, "smiley": 2 },
			//			{ "user": { "nick": "cfritzsche", "name": "Christoph Fritzsche", "picsmall": "content_img/profile_delegate_1.png", "picmini": "content_img/profile_small.png" }, "action": "for",
			//				"implemented": true, "smiley": 3 },
			//			{ "user": { "nick": "themarix", "name": "Matthias Bach", "picsmall": "content_img/profile_delegate_4.png", "picmini": "content_img/profile_small.png" }, "action": "against",
			//				"implemented": false, "smiley": 4 }
			//		], "opinionpage": 1, "opinionpages": 2
			finish();
		});
	});
}
