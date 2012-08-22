Bombay Crushed
==============

This is the public repository for [Bombay Crushed](http://saftigekumquat.org/2011/10/05/bombay-crushed/), a new UI for [Liquid Feedback](http://liquidfeedback.org/) currently developed by [Saftige Kumquat](http://saftigekumquat.org/).

Where to start?
---------------

`server.js` starts a server listening on [port 8080](http://localhost:8080) serving Bombay Crushed.

`config.default.json` contains default configuration values for `server.js`. Override values by setting them in a new file called `config.json`. You can configure
* the url and port of the Liquid Feedback API
* the url (prefix), port and host, where the service should be hosted

`ejscli.js` allows testing templates on the command line.

`apicli.js` contains code that, when executed via [node.js](http://nodejs.org/), connects to the [Liquid Feedback API Test Server](http://apitest.liquidfeedback.org:25520/) and pulls some information.

Requirements
------------

* [Node.js](http://nodejs.org/)
* [npm](http://npmjs.org/) modules:
 * EJS
 * cookies
 * canvas

Canvas requires Cairo to be installed. See [here](https://github.com/LearnBoost/node-canvas/wiki) for more information about canvas.
