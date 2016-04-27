
var MachineCanvas = function() {
	this.states = [];
	this._canvas = document.getElementById("canvas");
	this._instance = null;
	this._initializeJsPlumb();
};

MachineCanvas.prototype.addState = function(name, position) {
	var state = new State(this, name, position);
	this.states.push(state);
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
		var connectionName = null;
		while(!connectionName)
			connectionName = prompt("Enter connection specs (example: 1/1,L for read 1, write 1, direction L)")
		c.getOverlay("label").setLabel(connectionName);
	});

	instance.bind("dblclick", function (c) {
		instance.detach(c);
	});

	// bind a connection listener. note that the parameter passed to this function contains more than
	// just the new connection - see the documentation for a full list of what is included in 'info'.
	// this listener sets the connection's internal
	// id as the label overlay's text.
	instance.bind("connection", function (info) {
		var connectionName = prompt("Enter connection specs (example: 1/1,L for read 1, write 1, direction L)");
		info.connection.getOverlay("label").setLabel(connectionName);
	});

	jsPlumb.on(this._canvas, "dblclick", function(e) {
		var stateName = prompt('Enter the state name (example: q7)');
		machineCanvas.addState(stateName, {x:e.offsetX, y: e.offsetY});
	});

};


jsPlumb.ready(function () {
	var machineCanvas = new MachineCanvas();
});


var State = function(machineCanvas, name, position) {
	this.name = name;
	this.position = position;

	var d = document.createElement("div");
	d.className = "w";
	d.id = name;
	d.innerHTML = name + "<div class=\"ep\"></div>";
	d.style.left = position.x + "px";
	d.style.top = position.y + "px";
	machineCanvas._instance.getContainer().appendChild(d);

	machineCanvas._instance.draggable(d);

	machineCanvas._instance.makeSource(d, {
		filter: ".ep",
		anchor: "Continuous",
		connectorStyle: { strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4 },
		connectionType:"basic",
		extract:{
			"action":"the-action"
		},
		maxConnections: 8,
		onMaxConnections: function (info, e) {
			alert("Maximum connections (" + info.maxConnections + ") reached");
		}
	});

	machineCanvas._instance.makeTarget(d, {
		dropOptions: { hoverClass: "dragHover" },
		anchor: "Continuous",
		allowLoopback: true
	});

	$(d).on('dblclick', function(e) {
		e.stopPropagation();
		var newName = prompt('Rename state to');
		d.id = newName;
		d.innerHTML = newName + "<div class=\"ep\"></div>";
	});
};