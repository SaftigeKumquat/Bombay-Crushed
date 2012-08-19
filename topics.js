var lf = require('./lfcli.js');

var topics = function(state, render) {

	var tmp, tmp2, i;

	var units_by_id;
	var unit_id;
	var unit;
	var areas;
	var areas_by_id;
	var areas_by_unitid;
	var area;
	var privs;
	var issues_by_areaid;
	var issue;

	var finish = function() {
		var i_area, i_issue;
		var builtUnits = [];
		var builtUnit;
		var buildArea;
		var issues;

		// check all querys have come back
		if(units_by_id !== undefined && areas_by_id !== undefined
		   && areas_by_unitid !== undefined && issues_by_areaid !== undefined) {

			for(unit_id in units_by_id) {
				unit = units_by_id[unit_id];
				builtUnit = {
					'id': unit.id,
					'name': unit.name,
					'description': unit.description,
					'areas': []
				};
				// if description is empty, at least show the name
				if(unit.description === "") {
					builtUnit.description = builtUnit.name;
				}
				// sort areas by direct members
				areas_by_unitid[unit.id].sort(function(a,b){return b.direct_member_count - a.direct_member_count;});
				for(i_area = 0; i_area < areas_by_unitid[unit.id].length; i_area++) {
					area = areas_by_unitid[unit.id][i_area];

					status1 = status2 = status3 = status4 = status5 = status6 = 0;
					issues = issues_by_areaid[area.id];
					if(issues !== undefined) {
						for(i_issue = 0; i_issue < issues.length; i_issue++) {
							issue = issues[i_issue];
							switch(issue.state) {
								case "admission":
									status1++;
									break;
								case "discussion":
									status2++;
									break;
								case "verification":
									status3++;
									break;
								case "voting":
									status4++;
									break;
								case "canceled_revoked_before_accepted":
								case "canceled_issue_not_accepted":
								case "canceled_after_revocation_during_discussion":
								case "canceled_after_revocation_during_verification":
								case "canceled_no_initiative_admitted":
									status6++;
									break;
								case "calculation":
								case "finished_without_winner":
								case "finished_with_winner":
									status5++;
									break;
							}
						}
					}

					builtArea = {
						'name': area.name,
						'id': area.id,
						'topics': {
							'status1': status1,
							'status2': status2,
							'status3': status3,
							'status4': status4,
							'status5': status5,
							'status6': status6
						}
					};
					builtUnit.areas.push(builtArea);
				}
				builtUnits.push(builtUnit);
			}

			state.context.units = builtUnits;
			render();
		}
	}

	// get all issues
	lf.query('/issue', {}, state, function(res) {
		// store issues by area
		tmp = {}
		for(i = 0; i < res.result.length; i++) {
			issue = res.result[i];
			if(tmp[issue.area_id] === undefined) {
				tmp[issue.area_id] = [];
			}
			tmp[issue.area_id].push(issue);
		}
		issues_by_areaid = tmp;
		finish();
	});

	// query users units
	lf.query('/privilege', {'member_id': state.user_id(), 'include_units': true}, state,  function(res) {
		privs = res.result;
		units_by_id = res.units;

		var unit_ids = '';
		for(var unit_id in units_by_id) {
			if(unit_ids !== '') {
				unit_ids += ',';
			}
			unit_ids += unit_id;
		}

		// query of the users units areas
		lf.query('/area', {'unit_id': unit_ids}, state, function(res) {
			areas = res.result;
			tmp = {};
			tmp2 = {}
			for(i = 0; i < areas.length; i++) {
				area = areas[i];
				tmp[area.area_id] = area;
				if(tmp2[area.unit_id] === undefined) {
					tmp2[area.unit_id] = [];
				}
				tmp2[area.unit_id].push(area);
			}

			areas_by_id = tmp;
			areas_by_unitid = tmp2;
			finish();
		});
	});
}

exports.get = topics;
