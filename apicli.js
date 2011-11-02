#!/usr/bin/env node

// Load modules
var lfcli = require('./lfcli.js');

lfcli.query('/info', function(res) {
	console.log('Core Version: ' + res.core_version);
	console.log('API Version:  ' + res.api_version);
});

lfcli.query('/member_count', function(res) {
	console.log('Members: ' + res.total_count);
});

lfcli.query('/member', function(res) {
	var i;
	var members = res.result;
	for(i = 0; i < members.length; ++i) {
		var member = members[i];
		console.log('Member: ' + member.name);
	}
});

lfcli.query('/policy', function(res) {
	var i;
	var policies = res.result;
	console.log('Policies: ' + policies.length);
	for(i = 0; i < policies.length; ++i) {
		var policy = policies[i];
		console.log('Policy: ' + policy.name);
	}
});

lfcli.query('/unit', function(res) {
	var i;
	var units = res.result;
	console.log('Units: ' + units.length);
	for(i = 0; i < units.length; ++i) {
		var unit = units[i];
		console.log('Unit: ' + unit.name);
	}
});

lfcli.query('/area', function(res) {
	var i;
	var areas = res.result;
	console.log('Areas: ' + areas.length);
	for(i = 0; i < areas.length; ++i) {
		var area = areas[i];
		console.log('Area: ' + area.name);
	}
});

lfcli.query('/issue', function(res) {
	var i;
	var issues = res.result;
	console.log('Issues: ' + issues.length);
	for(i = 0; i < issues.length; ++i) {
		var issue = issues[i];
		console.log('Issue: ' + issue.state);
	}
});

lfcli.query('/initiative', function(res) {
	var i;
	var initiatives = res.result;
	console.log('Initiatives: ' + initiatives.length);
	for(i = 0; i < initiatives.length; ++i) {
		var initiative = initiatives[i];
		console.log('Initiative: ' + initiative.name);
	}
});
