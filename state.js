var Cookies = require('cookies');
var url = require('url');
var ejs = require('./ejs.js')

module.exports = function(serverError) {
	return {
		/**
		 * Create an object that keeps the state during a full request / response
		 * cycle. This state will not be kept between request. It's purpose is to
		 * bundle all data collected while building the response to one request.
		 */
		'create': function(req, res) {
			var state = {
				'request': req,
				'result': res,
				'fail': function(logmessage, errorcode) {
					serverError(state, logmessage, errorcode);
				},
				'cookies': new Cookies(req, res),
				'sendToLogin': function(message) {
					// TODO pass message to template
					ejs.render(state, '/login.tpl');
				},
				'context': {
						'meta': {'currentpage': ''}
				},
				'url': url.parse(req.url, true)
			};

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

			return state;
		}
	}
}
