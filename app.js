"use strict";
var express = require('express');
var path = require('path');
var http = require('http');
var randomstring = require("randomstring");
var bodyParser = require('body-parser');

var db = require('./db');
var publicFolder = path.join(__dirname, 'public');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

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
		res.send({id:id});
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

app.get('/get', function(req, res) {
	var id = req.query.id;
	db.machine.findAll({
		where: {
			id: id
		}
	}).then(function(machines) {
		res.send(machines[0].machineDefinition);
	});
});
//
app.get(/^\/([a-z0-9]{12})\/?$/, function(req, res) {
	res.sendfile(path.join(__dirname, 'public/index.html'));
});
app.use('/', express.static(publicFolder));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
	console.log('Express server listening on port ' + process.env.PORT || 3000);
});