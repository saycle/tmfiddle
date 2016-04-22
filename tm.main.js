

jsPlumb.ready(function () {

	// setup some defaults for jsPlumb.
	var instance = jsPlumb.getInstance({
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

	window.jsp = instance;

	var canvas = document.getElementById("canvas");
	var windows = jsPlumb.getSelector(".statemachine-demo .w");

	// bind a click listener to each connection; the connection is deleted. you could of course
	// just do this: jsPlumb.bind("click", jsPlumb.detach), but I wanted to make it clear what was
	// happening.
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

	// bind a double click listener to "canvas"; add new node when this occurs.
	jsPlumb.on(canvas, "dblclick", function(e) {
		newNode(e.offsetX, e.offsetY);
	});

	//
	// initialise element as connection targets and source.
	//
	var initNode = function(el) {

		// initialise draggable elements.
		instance.draggable(el);

		instance.makeSource(el, {
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

		instance.makeTarget(el, {
			dropOptions: { hoverClass: "dragHover" },
			anchor: "Continuous",
			allowLoopback: true
		});
		console.log("jsPlumbDemoNodeAdded");
		// this is not part of the core demo functionality; it is a means for the Toolkit edition's wrapped
		// version of this demo to find out about new nodes being added.
		//
		instance.fire("jsPlumbDemoNodeAdded", el);

		$(el).on('dblclick', function(e) {
			e.stopPropagation();
			var newName = prompt('Rename state to');
			el.id = newName;
			el.innerHTML = newName + "<div class=\"ep\"></div>";
		});
	};

	var newNode = function(x, y) {
		var id = prompt('Enter the state name (example: q7)');
		var d = document.createElement("div");
		//var id = jsPlumbUtil.uuid();
		d.className = "w";
		d.id = id;
		d.innerHTML = id + "<div class=\"ep\"></div>";
		d.style.left = x + "px";
		d.style.top = y + "px";
		instance.getContainer().appendChild(d);
		initNode(d);
		return d;
	};

	// suspend drawing and initialise.
	instance.batch(function () {
		for (var i = 0; i < windows.length; i++) {
			initNode(windows[i], true);
		}
		// and finally, make a few connections
		/*instance.connect({ source: "q0", target: "q1", type:"basic" });
		instance.connect({ source: "q1", target: "q2", type:"basic" });
		instance.connect({ source: "q2", target: "q3", type:"basic" });

		instance.connect({
			source:"q3",
			target:"q4",
			type:"basic"
		});*/
	});

	jsPlumb.fire("jsPlumbDemoLoaded", instance);


	window.setInterval(function() {
		console.log(instance);

		/*var code = $.map(windows, function(i,e) {
			return i.cssClass
		});

		$("#code").text(JSON.stringify(code));
		*/

	}, 5000);
});