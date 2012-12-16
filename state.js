/**
 * HTTP-Request-Response state handling.
 *
 * This module implements the state object which holds the data for an
 * HTTP-Request-Response cycle as well as utility function to work on
 * that cycle and the corresponding session.
 */

var Cookies = require('cookies');
var url = require('url');
var ejs = require('./ejs.js')
var config = require('./config.js');
var news = require('./overview.js');
var logger = require('./logger.js');

module.exports = function(serverError, invalidResource) {
	var app_prefix = '';
	if(config.listen.baseurl) {
		app_prefix = url.parse(config.listen.baseurl).pathname;
		logger(1, 'APP Prefix: ' + app_prefix);
	}

	return {
		/**
		 * Create an object that keeps the state during a full request / response
		 * cycle.
		 *
		 * This state will not be kept between request. It's purpose is to
		 * bundle all data collected while building the response to one request.
		 * In addition it allows easy access to the HTTP session by wrapping
		 * the cookies.
		 *
		 * The important entries of the created object are:
		 *  * `request`: The HTTP request object
		 *  * `response`: The HTTP response object
		 *  * `cookies`: Access to the cookie jar via http://search.npmjs.org/#/cookies
		 *  * `sendToLogin(message)`: Redirect the cycle to the login screen
		 *  * `context`: POD into which to store the data for the rendering process.
		 *  * `url`: The URL of the current request
		 *  * `local_path`: The path of the current request, within the current application, e.g. always just
		 *                  /overview for the start page, even if the app is run with the prefix /foo and the
		 *                  actual URL was something like http://some.server/foo/overview.
		 *  * `app_prefix`: Application prefix, the part of the path that's common to all pages
		 *  * `session_key(key): Convenient access to the current session key. Leave key undefined to get.
		 *  * `user_id(id): Convenient access to the current user id. Leave id undefined to get.
		 */
		'create': function(req, res) {
			var state = {
				'request': req,
				'result': res,
				'fail': function(logmessage, errorcode) {
					serverError(state, logmessage, errorcode);
				},
				'fail_invalidResource': function(logmessage, errorcode) {
					invalidResource(state, logmessage, errorcode);
				},
				'cookies': new Cookies(req, res),
				'context': {
						'meta': {
							'do_refresh': false,
							'currentpage': '',
							'baseurl': config.listen.baseurl ? config.listen.baseurl : ''
						}
				},
				'url': url.parse(req.url, true),
				'app_prefix': app_prefix
			};
			state.local_path = state.url.pathname.substring(app_prefix.length);
			if(state.local_path.length === 0) {
				state.local_path = '/overview';
			}
				

			var session_key, user_id;

			// convenience..
			state.session_key = function(key) {
				if(key === undefined) {
					if(session_key === undefined) {
						session_key = state.cookies.get('session_key');
					}
					return session_key;
				} else {
					session_key = key;
					state.cookies.set('session_key', session_key);
					return session_key;
				}
			}
			state.user_id = function(id) {
				if(id === undefined) {
					if(user_id === undefined) {
						user_id = state.cookies.get('user_id');
					}
					return user_id;
				} else {
					user_id = id;
					state.cookies.set('user_id', user_id);
					return user_id;
				}
			}

			/**
			 * Whether the current request cycle is being redirected to login.
			 * Used to avoid cycles in case rendering of the login page tries
			 * to retrieve data that would have required a login.
			 */
			var redirecting_to_login = false;
			state.sendToLogin = function(message) {
					if(redirecting_to_login) {
						return;
					}
					redirecting_to_login = true;
					// TODO pass message to template
					if(state.local_path != '/login') {
						state.context.meta.refresh_url = req.url;
					}
					news.showLogin(state);
					//ejs.render(state, '/login.tpl');
			}

			return state;
		}
	}
}
