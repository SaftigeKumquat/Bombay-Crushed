Bombay Crushed
==============

This is the public repository for [Bombay Crushed](http://saftigekumquat.org/2011/10/05/bombay-crushed/), a new UI for [Liquid Feedback](http://liquidfeedback.org/) currently developed by [Saftige Kumquat](http://saftigekumquat.org/).

Where to start?
---------------

`server.js` starts a server listening on [port 8080](http://localhost:8080) serving Bombay Crushed.

`ejscli.js` allows testing templates on the command line.

`apicli.js` contains code that, when executed via [node.js](http://nodejs.org/), connects to the [Liquid Feedback API Test Server](http://apitest.liquidfeedback.org:25520/) and pulls some information.

`dataCollectorDemo.js` contains some code showing how data can be collected from several parts and only processed once all parts are available.

Requirements
------------

* [Node.js](http://nodejs.org/)
* [npm](http://npmjs.org/) modules:
 * EJS
 * cookies
