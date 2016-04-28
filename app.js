"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var publicFolder = path.join(__dirname, 'public');

var app = express();
app.use('/', express.static(publicFolder));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
	console.log('Express server listening on port ' + process.env.PORT || 3000);
});