var lf = require('./lfcli.js');

var user = function(state, finish) {
	var unit_count = 0;

	var check = function() {
		console.log('TEST: ' + JSON.stringify(state.context.user.units) + ', unit_count: ' + unit_count);
		if(state.context.user !== undefined && state.context.user.units.length === unit_count
		&& unit_count !== 0) {
			console.log('SUCCESS');
			finish();
		}
	}

	lf.query('/member', {'member_id': state.user_id()}, state, function(res) {
		lf_user = res.result[0];
		var date = new Date(lf_user.birthday);
		state.context.user = {
			'nick': lf_user.name,
			'picbig': '/picbig/' + lf_user.id,
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
			'units': [ ]
		};

		check();
	} );

	lf.query('/privilege', {'member_id': state.user_id()}, state, function(priv_res) {
		unit_count = priv_res.result.length;
		for(var i = 0; i < unit_count; i++) {
			lf.query('/unit', {'unit_id': priv_res.result[i].unit_id}, state, function(unit_res) {
				state.context.user.units.push({'name': unit_res.result[0].name});
				check();
			});
		}
		check();
	} );
}

exports.get = user;
