"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var randomstring = require("randomstring");
var bodyParser = require('body-parser')

var db = require('./db');
var publicFolder = path.join(__dirname, 'public');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies

var generateId = function() {
	return randomstring.generate({
		length:12,
		charset: '0123456789abcdefghijklmnopqrstuvwxyz'
	});
}

app.post('/save', function(req, res) {
	var id = generateId();

	db.machine.create({
		id: id,
		machineDefinition: req.body
	}).then(function(machine) {
		res.send(id);
	});

	/*return User.create({
		username: 'janedoe',
		birthday: new Date(1980, 6, 20)
	});
	}).then(function(jane) {
		console.log(jane.get({
			plain: true
		}));
	});*/
});

app.use('/', express.static(publicFolder));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
	console.log('Express server listening on port ' + process.env.PORT || 3000);
});