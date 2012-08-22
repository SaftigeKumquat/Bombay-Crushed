var lf = require('./lfcli.js');

/**
 * Returns the object required by templates for an API member object
 *
 * @param query_res member object as provided by API
 */
exports.getUserBasic = function(query_res) {
	builtUser = {};
	builtUser.nick = query_res.name;
	builtUser.name = query_res.realname;
	if(builtUser.name == "" || builtUser.name == null) {
		builtUser.name = builtUser.nick;
	}
	builtUser.id = query_res.id;
	builtUser.picmini = 'picmini/' + query_res.id;
	builtUser.picsmall = 'avatar/' + query_res.id;
	builtUser.picbig = 'picbig/' + query_res.id;

	return builtUser;
}

var user = function(state, finish, allowOtherMember) {
	var unit_count = -1;
	var units = [];

	var check = function() {
		if(state.context.user !== undefined && units.length === unit_count
		&& unit_count !== -1) {
			state.context.user.units = units;
			console.log('SUCCESS');
			finish();
		}
	}

	var member_id;
	if(state.url.query.user_id !== undefined && allowOtherMember == true) {
		member_id = state.url.query.user_id;
	}
	else {
		member_id = state.user_id();
	}

	lf.query('/member', {'member_id': member_id}, state, function(res) {
		lf_user = res.result[0];
		var date = new Date(lf_user.birthday);
		state.context.user = {
			'nick': lf_user.name,
			'picbig': 'picbig/' + lf_user.id,
			'name': lf_user.realname,
			'website': lf_user.website,
			'profession': lf_user.profession,
			'birthdate': date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear(),
			'email': lf_user.email,
			'jabber': lf_user.xmpp_address,
			'phone': lf_user.phone,
			'mobile': lf_user.mobile_phone,
			'statement': lf_user.statement,
			'offices': lf_user.internal_posts,
			'memberships': lf_user.external_memberships,
		};

		// delete dummy content
		state.context.delegateactions = [];
		state.context.strongestdelegates = [];
		state.context.votingcomments = [];

		if(member_id == state.user_id()) {
			state.context.user.isme = true;
		}

		check();
	} );

	lf.query('/privilege', {'member_id': state.user_id()}, state, function(priv_res) {
		unit_count = priv_res.result.length;
		for(var i = 0; i < unit_count; i++) {
			lf.query('/unit', {'unit_id': priv_res.result[i].unit_id}, state, function(unit_res) {
				units.push({'name': unit_res.result[0].name});
				check();
			});
		}
		check();
	} );
}

exports.get = user;
