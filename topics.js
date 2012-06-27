var lf = require('./lfcli.js');

var topics = function(state, render) {
	var byArea = [];
	var byUnit = [];
	var units = [];
	var areaId, unitId;
	var areasFound = 0; 
	var areasResolved = 0;
	var unitsFound = 0; 
	var unitsResolved = 0;
	var issuesFinished = false;

	var builtArea;	
	var builtUnit;
	var builtUnits = [];

	var finish = function() {
		// check all querys have come back
				if(issuesFinished && areasFound <= areasResolved
			&& unitsFound <= unitsResolved ) {
			
			for(var i = 0; i < units.length; i++) {
				if(units[i] !== undefined && byUnit[i] !== undefined) {
					builtUnit = {
						'id': units[i].id,
						'name': units[i].name,
						'description': units[i].description,
						'areas': []
					};
					// if description is empty, at least show the name
					if(units[i].description === "") {
						builtUnit.description = builtUnit.name;
					}
					// sort areas by direct members
					byUnit[i].sort(function(a,b){return b.direct_member_count - a.direct_member_count;});

					for(var a = 0; a < byUnit[i].length; a++) {
						currentArea = byUnit[i][a];
						
						status1 = status2 = status3 = status4 = status5 = status6 = 0;	
						if(byArea[currentArea.id] !== undefined) {					
							for(var b = 0; b < byArea[currentArea.id].length; b++) {
								currentIssue = byArea[currentArea.id][b];
								switch(currentIssue.state) {
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
										status6++;
										break;
									case "canceled_issue_not_accepted":
										status6++;
										break;
									case "canceled_after_revocation_during_discussion":
										status6++;
										break;
									case "canceled_after_revocation_during_verification":
										status6++;
										break;
									case "calculation":
										status5++;
										break;
									case "canceled_no_initiative_admitted":
										status6++;
										break;
									case "finished_without_winner":
										status5++;
										break;
									case "finished_with_winner":
										status5++;
										break;
								}
							}
						}

						builtArea = {
							'name': currentArea.name,
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
			}

			state.context.units = builtUnits;
			render();
		}
	}

	// get all issues
	lf.query('/issue', {}, state, function(res) {
		// store issues by area
		for(var i = 0; i < res.result.length; i++) {
			areaId = res.result[i].area_id;
			if(byArea[areaId] === undefined) {
				byArea[areaId] = [];
				areasFound++;
			}
			byArea[areaId].push(res.result[i]);
		}
		issuesFinished = true;
		finish();
	});

	// get all areas
	lf.query('/area', {}, state, function(area_res) {
		// store areas by unit
		for(var i = 0; i < area_res.result.length; i++) {
			areasResolved++;
			unitId = area_res.result[i].unit_id;
			if(byUnit[unitId] === undefined) {
				byUnit[unitId] = [];
				unitsFound++;
			}
			byUnit[unitId].push(area_res.result[i]);
		}
		finish();
	});

	// get all units
	lf.query('/unit', {}, state, function(unit_res) {
		// store units
		for(var i = 0; i < unit_res.result.length; i++) {
			unitsResolved++;
			units[unit_res.result[i].id] = unit_res.result[i];
		}
		finish();
	});
		
}

exports.get = topics;
