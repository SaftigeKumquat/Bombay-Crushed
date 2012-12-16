var config = require('./config.js');

/**
 * Log a message to the console
 *
 * @loglevel defines the level of detail of the message.
 * 	0 to be used for service level (version, port etc)
 *	1 to be used for server infrastructure (requests, templates etc)
 *	2 to be used for basic query debug info
 *	3 for more detailed stuff..
 * @text the text to be logged
 */

module.exports = function(loglevel, text) {
	if(loglevel <= config.debug.loglevel) {
		console.log(text);
	}
}
