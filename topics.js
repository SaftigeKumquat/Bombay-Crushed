var lf = require('./lfcli.js');
var ejs = require('./ejs.js');

function topics(state, render) {

	var units_by_id;
	var areas_by_unitid;
	var issues_by_areaid;

	var finish = function() {
		var unit;
		var unit_id;
		var builtUnits = [];

		// check all querys have come back
		if(units_by_id !== undefined && areas_by_unitid !== undefined && issues_by_areaid !== undefined) {

			for(unit_id in units_by_id) {
				unit = units_by_id[unit_id];
				builtUnits.push(build_unit(unit, areas_by_unitid[unit.id], issues_by_areaid));
			}

			state.context.units = builtUnits;
			render();
		}
	}

	// get all issues
	// TODO limit to relevant units
	lf.query('/issue', {}, state, function(res) {
		// store issues by area
		var issue;
		var tmp = {}
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
		units_by_id = res.units;

		var unit_id;
		var unit_ids = '';
		for(var unit_id in units_by_id) {
			if(unit_ids !== '') {
				unit_ids += ',';
			}
			unit_ids += unit_id;
		}

		// query of the users units areas
		lf.query('/area', {'unit_id': unit_ids}, state, function(res) {
			var area;
			var areas = res.result;
			var tmp = {}
			for(i = 0; i < areas.length; i++) {
				area = areas[i];
				if(tmp[area.unit_id] === undefined) {
					tmp[area.unit_id] = [];
				}
				tmp[area.unit_id].push(area);
			}

			areas_by_unitid = tmp;
			finish();
		});
	});
}

exports.get = topics;

exports.update_areas_table = function(state) {
	var unit_id = state.url.query.unit_id;
	var sort_id = state.url.query.sort;

	if(!unit_id) {
		state.fail_invalidResource('No unit id given.', 400);
		return;
	}

	// storage for the queried data for rendering
	var lf_areas;
	var lf_issues_by_areaid;

	var finish = function() {
		if(lf_areas !== undefined && lf_issues_by_areaid !== undefined) {
			var areas = build_areas(lf_areas, lf_issues_by_areaid, sort_id);
			state.context.areas = areas;
			ejs.render(state, '/update_area_table.tpl', true);
		}
	}

	// query the areas of the given unit
	// query of the users units areas
	lf.query('/area', {'unit_id': unit_id}, state, function(res) {
		var i, area;
		lf_areas = res.result;
		finish();
	});

	// query the issues of the given unit
	// get all issues
	lf.query('/issue', {'unit_id': unit_id}, state, function(res) {
		var i, issue;
		// store issues by area
		var tmp = {}
		for(i = 0; i < res.result.length; i++) {
			issue = res.result[i];
			if(tmp[issue.area_id] === undefined) {
				tmp[issue.area_id] = [];
			}
			tmp[issue.area_id].push(issue);
		}
		lf_issues_by_areaid = tmp;
		finish();
	});
}

/**
 * Built a unit as required by the template.
 *
 * @param unit The liquid feedback API object of the unit
 * @param areas The liquid feedback API objects of all areas in the unit as array
 */
function build_unit(unit, areas, issues_by_areaid, sort_id) {
	var builtUnit = {
		'id': unit.id,
		'name': unit.name,
		'description': unit.description,
		'areas': build_areas(areas, issues_by_areaid, sort_id)
	};
	// if description is empty, at least show the name
	if(unit.description === "") {
		builtUnit.description = builtUnit.name;
	}

	return builtUnit;
}

function build_areas(areas, issues_by_areaid, sort_id) {
	var i_area, i_issue;
	var area;
	var status1, status2, status3, status4, status5, status6;
	var issues;
	var issue;
	var builtArea;
	var builtAreas = [];

	// sort areas by direct members
	areas.sort(area_sort_function(sort_id));
	for(i_area = 0; i_area < areas.length; i_area++) {
		area = areas[i_area];

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
		builtAreas.push(builtArea);
	}
	return builtAreas;
}

function area_sort_function(sort_id) {
	logger(2, 'SORT FUNCTION SELECTION: ' + sort_id);
	if(sort_id == 2) { // we want implicit conversion between int and string, therefore == instead of ===
		logger(2, 'Returning sort function 2');
		return function(a,b){
			var A = a.name;
			var B = b.name;
			return (A==B) ? 0 :((A < B) ? -1 : 1);
		};
	} else {
		logger(2, 'Returtning sort function 1');
		return function(a,b){return b.direct_member_count - a.direct_member_count;}
	}
}
