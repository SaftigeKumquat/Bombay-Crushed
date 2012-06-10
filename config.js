var fs = require('fs');

/** @file
 * Configuration file handling.
 *
 * Public API:
 *  * `config`: Configuration object
 */

// read config
var config = JSON.parse(fs.readFileSync('config.default.json'));
try { // this does not necessarily exist
	custom = JSON.parse(fs.readFileSync('config.json'));
	for(key in custom) {
		config[key] = custom[key];
	};
} catch(err) {
	console.log('No custom configuration, using defaults');
}

module.exports = config;
