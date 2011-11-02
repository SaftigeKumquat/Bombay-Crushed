#!/usr/bin/env node

// Load modules
var lfcli = require('./lfcli.js');

lfcli.query('/info', function(res) {
	console.log('Core Version: ' + res.core_version);
	console.log('API Version:  ' + res.api_version);
});
