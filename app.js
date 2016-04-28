"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var publicFolder = path.join(__dirname, 'public');

var app = express();
app.use('/public', express.static(publicFolder));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

var server = http.createServer(app);
server.listen(3000, function () {
	console.log('Express server listening on port ' + 3000);
});