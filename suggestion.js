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

	var finish = function() {
		var ctx = state.context;
		if(ctx.suggestion) {
			ctx.meta.currentpage = "suggestion";
			console.log(JSON.stringify(ctx));
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

		var suggestion = {
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
		notimplementedneutralsupporter = suggestion.neutralsupporter;
		implementedneutralsupporter = suggestion.neutralsupporter;

		suggestion.mustsupportwidth = suggestion.mustsupporter * 100 / total_supporters + "%";
		suggestion.shouldsupportwidth = suggestion.shouldsupporter * 100 / total_supporters + "%";
		suggestion.neutralsupportwidth = suggestion.neutralsupporter * 100 / total_supporters + "%";
		suggestion.shouldnotsupportwidth = suggestion.shouldnotsupporter * 100 / total_supporters + "%";
		suggestion.mustnotsupportwidth = suggestion.mustnotsupporter * 100 / total_supporters + "%";

		suggestion.notimplementedmustsupportwidth = suggestion.notimplementedmustsupporter * 100 / total_supporters + "%";
		suggestion.notimplementedshouldsupportwidth = suggestion.notimplementedshouldsupporter * 100 / total_supporters + "%";
		suggestion.notimplementedneutralsupportwidth = suggestion.notimplementedneutralsupporter * 100 / total_supporters + "%";
		suggestion.notimplementedshouldnotsupportwidth = suggestion.notimplementedshouldnotsupporter * 100 / total_supporters + "%";
		suggestion.notimplementedmustnotsupportwidth = suggestion.notimplementedmustnotsupporter * 100 / total_supporters + "%";
		suggestion.implementedmustsupportwidth = suggestion.notimplementedmustsupporter * 100 / total_supporters + "%";
		suggestion.implementedshouldsupportwidth = suggestion.notimplementedshouldsupporter * 100 / total_supporters + "%";
		suggestion.implementedneutralsupportwidth = suggestion.notimplementedneutralsupporter * 100 / total_supporters + "%";
		suggestion.implementedshouldnotsupportwidth = suggestion.notimplementedshouldnotsupporter * 100 / total_supporters + "%";
		suggestion.implementedmustnotsupportwidth = suggestion.notimplementedmustnotsupporter * 100 / total_supporters + "%";
//	 "isayimplemented": true, TODO

		suggestion.opinions = []; // TODO
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

		// add author info
		lf.query('/member', { 'member_id': suggestion_res.author_id }, state, function(res) {
			var author = res.result[0];
			console.log("AUTHOR: " + JSON.stringify(author));

			suggestion.author = {
				nick: author.name,
				name: author.realname || author.name,
				picsmall: "avatar/" + author.id,
				picmini: "picbig/" + author.id
			}

			state.context.suggestion = suggestion;
			finish();
		});
	});
}
