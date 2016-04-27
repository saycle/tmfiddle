
var configurationExample = {
	states: {
		'q0': {
			presentation: {
				position: { x: 100, y: 100 }
			},
			connections: {
				'0': {
					write: '0',
					move: 'R',
					newState: 'q0'
				},
				'1': {
					write: '1',
					move: 'R',
					newState: 'q0'
				},
				' ': {
					write: ' ',
					move: 'L',
					newState: 'q1'
				}
			},
			accepted: false
		},
		'q1': {
			presentation: {
				position: { x: 300, y: 100 }
			},
			connections: {
				'0': {
					write: '1',
					move: 'R',
					newState: 'q2'
				},
				'1': {
					write: '0',
					move: 'L',
					newState: 'q1'
				},
				' ': {
					write: '1',
					move: 'R',
					newState: 'q2'
				}
			},
			accepted: false,
		},
		'q2': {
			presentation: {
				position: { x: 500, y: 100 }
			},
			connections: {
			},
			accepted: true,
		}
	},
	startState: 'q0'
};

// Enable persistent configuration
var configuration = localStorage.configuration ? JSON.parse(localStorage.configuration) : configurationExample;

var MachineCanvas = function() {
	var self = this;
	window.states = self.states;
	self._canvas = document.getElementById("canvas");
	self._instance = null;
	self._initializeJsPlumb();

	// Load initial configuration
	jQuery.each(configuration.states, function(i,s) {
		self.addState(i, s);
	});

	// Connect states
	jQuery.each(configuration.states, function(i,s) {
		jQuery.each(s.connections, function(k, c) {
			var connection = self._instance.connect({
				source: i,
				target: c.newState,
				type: 'basic'
			});
			var label = k + '/' + c.write + "," + c.move;
			//label = label.replace(/ /g, '_'); // replace blank chars
			connection.getOverlay("label").setLabel(label);
		});
	});
};

MachineCanvas.prototype.addState = function(name, model) {
	var state = new State(name, model, this);
};

MachineCanvas.prototype._initializeJsPlumb = function() {
	var machineCanvas = this;
	var instance = machineCanvas._instance = jsPlumb.getInstance({
		Endpoint: ["Dot", {radius: 2}],
		Connector:"StateMachine",
		HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2 },
		ConnectionOverlays: [
			[ "Arrow", {
				location: 1,
				id: "arrow",
				length: 14,
				foldback: 0.8
			} ],
			[ "Label", { label: "", id: "label", cssClass: "aLabel" }]
		],
		Container: "canvas"
	});
	instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

	instance.bind("click", function (c) {
		var connectionName = promptConnectionName(c.getOverlay("label").getLabel());
		c.getOverlay("label").setLabel(connectionName);
	});

	instance.bind("dblclick", function (c) {
		instance.detach(c);
	});

	instance.bind("connection", function (info, e) {
		if(e != null) // if event is null, the connection has been created programmatically
			info.source.addConnection(info);
	});

	instance.bind("connectionDetached", function(info) {
		info.source.removeConnection(info);
	});

	jsPlumb.on(this._canvas, "dblclick", function(e) {
		var stateName = prompt('Enter the state name (example: q7)');
		if(configuration.states[stateName] != null)
			alert("State with the id " + stateName + " already exists.");
		else {
			configuration.states[stateName] = {
				presentation: {
					position: {x: e.offsetX, y: e.offsetY}
				},
				connections: {},
				accepted: false,
			};
			machineCanvas.addState(stateName, configuration.states[stateName]);
		}
	});

};


var promptConnectionName = function(defaultValue) {
	var connectionName = null;
	while(!connectionName || !/^.\/.,[LR]$/.test(connectionName))
		connectionName = prompt("Enter connection specs (example: 1/1,L for read 1, write 1, direction L)", defaultValue);
	return connectionName;
};

jsPlumb.ready(function () {
	var machineCanvas = new MachineCanvas();
});

var State = function(name, model, machineCanvas) {
	var self = this;

	var d = document.createElement("div");
	d.model = model;

	d.className = "w";
	d.id = name;
	d.innerHTML = name + "<div class=\"ep\"></div>";
	d.style.left = model.presentation.position.x + "px";
	d.style.top = model.presentation.position.y + "px";
	machineCanvas._instance.getContainer().appendChild(d);

	machineCanvas._instance.draggable(d, {
		drag: function(draggedWrapper) {
			model.presentation.position.x = $(draggedWrapper.el).offset().left;
			model.presentation.position.y = $(draggedWrapper.el).offset().top;
		}
	});

	machineCanvas._instance.makeSource(d, {
		filter: ".ep",
		anchor: "Continuous",
		connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
		connectionType:"basic",
		extract:{
			"action":"the-action"
		},
		maxConnections: -1
	});

	machineCanvas._instance.makeTarget(d, {
		dropOptions: { hoverClass: "dragHover" },
		anchor: "Continuous",
		allowLoopback: true
	});

	$(d).on('dblclick', function(e) {
		e.stopPropagation();
		var newName = prompt('Rename state to');

		configuration.states[newName] = configuration.states[d.id];
		delete configuration.states[d.id];
		d.id = newName;
		d.innerHTML = newName + "<div class=\"ep\"></div>";

	});

	d.addConnection = function(info) {

		var connectionName = null;
		while(!connectionName || model.connections[connectionName.split('/')[0]] != null)
			connectionName = promptConnectionName('');

		info.connection.getOverlay("label").setLabel(connectionName);
		model.connections[connectionName.split('/')[0]] = {
			write: connectionName.split('/')[1].split(',')[0],
			move: connectionName.split('/')[1].split(',')[1],
			newState: info.target.id
		};

	};

	d.removeConnection = function(info) {
		delete model.connections[info.connection.getOverlay("label").getLabel().split('/')[0]];
	};
};

window.setInterval(function() {
	$("#code").html( JSON.stringify(configuration, null, 2));
	localStorage.configuration = JSON.stringify(configuration);
}, 1000);