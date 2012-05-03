var lf = require('./lfcli.js');

var inis = function(state, render) {
	var events = [];
	var issues = [];
	var areas = [];
	var units = [];
	var inis = [];
	var policies = [];

	var activepage;
	state.context.initable = {};
	if(state.url.query.page !== undefined) {
		activepage = state.url.query.page - 1;
		state.context.initable.activepage = state.url.query.page;
	}
	else {
		activepage = 0;
		state.context.initable.activepage = 1;
	}
 
	var finish = function() {
		builtInis = [];
		if(events.length === issues.length
			&& events.length === areas.length
			&& events.length === units.length
			&& events.length === inis.length
			&& events.length === policies.length) {

			for(var i = 0; i < events.length; i++) {
				var ini = { lastaction: {} };
				date = new Date(events[i].occurrence);
				ini.lastaction.date = date.getDate() + '.' + ( date.getMonth() + 1 ) + '.' + date.getFullYear();
				ini.lastaction.time = date.getHours() + ':' + date.getMinutes();
				switch(events[i].event) {
					case "initiative_created_in_existing_issue":
						ini.lastaction.action = "Neue Initiative";
						break;
					case "initiative_created_in_new_issue":
						ini.lastaction.action = "Neues Thema";
						break;
					case "suggestion_created":
						ini.lastaction.action = "Neue Anregung";
						break;
					case "new_draft_created":
						ini.lastaction.action = "Neuer Entwurf";
						break;
					case "initiative_revoked":
						ini.lastaction.action = "Initative zurückgezogen";
						break;
					case "issue_state_changed":
						switch(events[i].state) {
							case "finished_with_winner":
								ini.lastaction.action = "Abstimmung beendet";
								break;
							case "verification":
								ini.lastaction.action = "Thema eingefroren";
								break;
							case "voting":
								ini.lastaction.action = "Abstimmung begonnen";
								break;
							case "discussion":
								ini.lastaction.action = "Thema zugelassen";
								break;
							case "admission":
								ini.lastaction.action = "Neues Thema";
								break;
							case "finished_without_winner":
								ini.lastaction.action = "Thema Abgebrochen";
								break;
						}
						break;
				}
				switch(events[i].state) {
					case "finished_with_winner":
						ini.status = "5.Abgeschlossen";
						break;
					case "verification":
						ini.status = "3.Eingefroren";
						break;
					case "voting":
						ini.status = "4.Abstimmung";
						break;
					case "discussion":
						ini.status = "2.Diskussion";
						break;
					case "admission":
						ini.status = "1.Neu";
						break;
					case "finished_without_winner":
						ini.status = "Abgebrochen";
						break;
				}
				for(var j = 0; j < inis.length; j++) {
					if(inis[j].issue_id === events[i].issue_id) {
						ini.id = inis[j].id;
						ini.title = inis[j].name;
						ini.supporter = inis[j].satisfied_supporter_count;
						ini.potsupporter = inis[j].supporter_count - inis[j].satisfied_supporter_count;
					}
				}
				var quorum_num, quorum_den;
				for(var a = 0; a < issues.length; a++) {
					if(issues[a].id === events[i].issue_id) {
						for(var b = 0; b < areas.length; b++) {
							if(areas[b].id === issues[a].area_id) {
								ini.area = areas[b].name;
								// TODO number for uninterested is sometimes negative?
								ini.uninterested = ( areas[b].member_weight - ini.supporter ) - ini.potsupporter;
								if(ini.uninterested < 0) {
									ini.uninterested = 0;
								}
								for(var c = 0; c < units.length; c++) {
									if(units[c].id === areas[b].unit_id) {
										ini.unit = units[c].name;
									}
								}
							}
						}
						for(var k = 0; k < policies.length; k++) {
							if(issues[a].policy_id === policies[k].id) {
								quorum_num = policies[k].issue_quorum_num;
								quorum_den = policies[k].issue_quorum_den;
							}
						}
					}
				}
				var total = ini.supporter + ini.potsupporter + ini.uninterested;
				ini.support = Math.floor(( ini.supporter / total ) * 100);
				ini.potential = Math.floor(( ini.potsupporter / total ) * 100);
				ini.uninvolved = Math.floor(( ini.uninterested / total ) * 100);
				ini.quorum = Math.floor(total * quorum_num / quorum_den);
				builtInis.push(ini);
			}
			state.context.inis = builtInis;
			render();			
		}
	}

	// get last events
 	lf.query('/event', {}, state, function(res) {
		// calculate number of pages
		var foundissues = [];
		var foundissue = false;
		for(var i = 0; i < res.result.length; i++) {
			foundissue = false;
			for(var j = 0; j < foundissues.length; j++) {
				if(foundissues[j] == res.result[i].issue_id) {
					foundissue = true;
				}
			}
			if(foundissue == false) {
				foundissues.push(res.result[i].issue_id);
			}
		}

		state.context.initable.pages = Math.ceil(foundissues.length / 5);
		var end = ( activepage * 5 ) + 5;
		var found = false;
		var foundpage = false;
		for(var i = activepage * 5; i < res.result.length && i < end; i++) {
			// start with first found issue on the page
			if(foundpage == false && res.result[i].issue_id != foundissues[activepage * 5]) {
				end = end + 1;
				continue;
			}
			else {
				foundpage = true;
			}

			found = false;
			// check if event has issue that was already registered
			for(var l = 0; l < events.length; l++) {
				if(events[l].issue_id == res.result[i].issue_id) {
					found = true;
					break;
				}
			}
			if(found == false) {
				events.push(res.result[i]);
			}
			else {
				end = end + 1;
				continue;
			}
			// get issue for event
			lf.query('/issue', {'issue_id': res.result[i].issue_id}, state, function(issue_res) {
				issues.push(issue_res.result[0]);
				// get area for issue
				lf.query('/area', {'area_id': issue_res.result[0].area_id}, state, function(area_res) {
					areas.push(area_res.result[0]);
					// get unit for area
					lf.query('/unit', {'unit_id': area_res.result[0].unit_id}, state, function(unit_res) {
						units.push(unit_res.result[0]);						
						finish();
					});
					finish();
				});
				// get policy for issue
				lf.query('/policy', {'policy_id': issue_res.result[0].policy_id}, state, function(pol_res) {
					policies.push(pol_res.result[0]);
					finish();
				});
				// get inis for issue
				lf.query('/initiative', {'issue_id': issue_res.result[0].id}, state, function(ini_res) {
					// get the leading ini
					var found = false;
					for(var j = 0; j < ini_res.result.length; j++) {
						if(ini_res.result[j].rank === 1) {
							inis.push(ini_res.result[j]);	
							found = true;						
						}
					}
					if(found === false) {
						var leadingIni = ini_res.result[0];
						for(var j = 0; j < ini_res.result.length; j++) {
							if(leadingIni.satisfied_supporter_count < ini_res.result[j].satisfied_supporter_count) {
								leadingIni = ini_res.result[j];
							}
						}
						inis.push(leadingIni);
					}
					finish();
				});
				finish();
			});
		}
		finish();
	});
};

module.exports = inis;
