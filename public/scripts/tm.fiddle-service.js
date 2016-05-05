
var FiddleService = function() {};

FiddleService.prototype.getFiddle = function(id) {
	return $.get('/get?id=' + id);
};

// Saves a fiddle and returns the generated id
FiddleService.prototype.saveFiddle = function(machine) {
	return $.ajax({
		url: '/save',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(configuration),
		dataType: 'json'
	}).then(function(result) {
		return result.id;
	}, function(reason) {
		alert("error");
		console.log(reason);
	});
};