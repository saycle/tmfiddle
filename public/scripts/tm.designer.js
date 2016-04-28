// Enable persistent configuration
var configuration = JSON.parse(localStorage.configuration) || { states: {} };
var MachineCanvas = function () {

    var self = this;
    self.tool = 'move';
    window.states = self.states;
    self._canvas = document.getElementById("canvas");
    self._instance = null;
    self._initializeJsPlumb();
    self.initState();

    $(document).ready(function () {
        if(JSON.parse(localStorage.configuration))
            $("#example-selector").val("local");
        $("#example-selector-local").prop('disabled', !JSON.parse(localStorage.configuration));

        $("#example-selector").change(function () {
            $.ajax($(this).val()).done(function (res) {
                configuration = res;
                self._instance.reset();
                self._canvas.innerHTML = "";
                self.initState();
                setTimeout(function () {
                    jsPlumb.repaintEverything();
                }, 20);
            });
        });

        $(".tm-designer-tool").click(function () {
            self.tool = $(this).attr('tool');
            $(".tm-designer-tool").removeClass('btn-primary');
            $(this).addClass('btn-primary');
        });

    });
};

MachineCanvas.prototype.initState = function () {
    var self = this;


    // Load initial configuration
    jQuery.each(configuration.states, function (i, s) {
        self.addState(i, s);
    });

    // Connect states
    jQuery.each(configuration.states, function (i, s) {
        jQuery.each(s.connections, function (k, c) {
            try {

                var connection = self._instance.connect({
                    source: i,
                    target: c.newState,
                    type: 'basic'
                });
                var label = k + '/' + c.write + "," + c.move;
                //label = label.replace(/ /g, '_'); // replace blank chars
                connection.getOverlay("label").setLabel(label);
            }
            catch (e) { // endpoint does not exist - remove connection
                console.log(e);
                delete s.connections[k];
            }
        });
    });

};

MachineCanvas.prototype.addState = function (name, model) {
    var state = new State(name, model, this);
};

MachineCanvas.prototype._initializeJsPlumb = function () {
    var machineCanvas = this;
    var instance = machineCanvas._instance = jsPlumb.getInstance({
        Endpoint: ["Dot", {radius: 2}],
        Connector: "StateMachine",
        HoverPaintStyle: {strokeStyle: "#1e8151", lineWidth: 2},
        ConnectionOverlays: [
            ["Arrow", {
                location: 1,
                id: "arrow",
                length: 14,
                foldback: 0.8
            }],
            ["Label", {label: "", id: "label", cssClass: "aLabel"}]
        ],
        Container: "canvas"
    });
    instance.registerConnectionType("basic", {anchor: "Continuous", connector: "StateMachine"});

    instance.bind("click", function (c) {
        // Connection click
        if (machineCanvas.tool == 'remove')
            instance.detach(c);
        else {
            var connectionName = promptConnectionName(c.getOverlay("label").getLabel());
            c.getOverlay("label").setLabel(connectionName);
        }
    });

    /*instance.bind("dblclick", function (c) {
     instance.detach(c);
     });*/
    instance.bind("connection", function (info, e) {
        if (e != null) // if event is null, the connection has been created programmatically
            info.source.addConnection(info);
    });

    instance.bind("connectionDetached", function (info) {
        info.source.removeConnection(info);
    });

    jsPlumb.on(this._canvas, "dblclick", function (e) {
        var stateName = prompt('Enter the state name (example: q7)');
        if(stateName == null)
            return;

        if (configuration.states[stateName] != null)
            alert("State with id " + stateName + " already exists.");
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


var promptConnectionName = function (defaultValue) {
    var connectionName = null;
    var read = defaultValue.split('/')[0];
    var write = defaultValue.split('/')[1].split(',')[0];
    var move = defaultValue.split('/')[1].split(',')[1];
    $("#connection-read").val(read)
    $("#connection-write").val(write);
    $("#connection-move").val(move);
    $("#editConnectionModal").modal("show");
    //while (!connectionName || !/^.\/.,[LR]$/.test(connectionName)) {
    //connectionName = prompt("Enter connection specs (example: 1/1,L for read 1, write 1, direction L)", defaultValue);
    //}
    return connectionName;
};

jsPlumb.ready(function () {
    var machineCanvas = new MachineCanvas();
});


var State = function (name, model, machineCanvas) {
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
        drag: function (draggedWrapper) {
            $(draggedWrapper.el).one('click', function (e) {
                e.stopPropagation();
            });
            model.presentation.position.x = draggedWrapper.pos[0];
            model.presentation.position.y = draggedWrapper.pos[1];// - $(machineCanvas._instance.getContainer()).offset().top;
        }
    });

    machineCanvas._instance.makeSource(d, {
        filter: ".ep",
        anchor: "Continuous",
        connectorStyle: {strokeStyle: "#5c96bc", lineWidth: 2, outlineColor: "transparent", outlineWidth: 4},
        connectionType: "basic",
        extract: {
            "action": "the-action"
        },
        maxConnections: -1
    });

    machineCanvas._instance.makeTarget(d, {
        dropOptions: {hoverClass: "dragHover"},
        anchor: "Continuous",
        allowLoopback: true
    });

    $(d).on('click', function (e) {

        e.stopPropagation();

        if (machineCanvas.tool == 'edit') {
            var newName = prompt('Rename state to', d.id);
            if (newName == d.id || newName == null)
                return;
            configuration.states[newName] = configuration.states[d.id];
            delete configuration.states[d.id];
            d.id = newName;
            d.innerHTML = newName + "<div class=\"ep\"></div>";
        }
        else if (machineCanvas.tool == 'remove') {
            machineCanvas._instance.detachAllConnections(d.id);
            machineCanvas._instance.removeAllEndpoints(d.id);
            machineCanvas._instance.detach(d.id);
            d.remove();
            delete configuration.states[d.id];
        }

    });

    d.addConnection = function (info) {

        var connectionName = null;
        while (!connectionName || model.connections[connectionName.split('/')[0]] != null)
            connectionName = promptConnectionName('');

        info.connection.getOverlay("label").setLabel(connectionName);
        model.connections[connectionName.split('/')[0]] = {
            write: connectionName.split('/')[1].split(',')[0],
            move: connectionName.split('/')[1].split(',')[1],
            newState: info.target.id
        };

    };

    d.removeConnection = function (info) {
        delete model.connections[info.connection.getOverlay("label").getLabel().split('/')[0]];
    };
};

window.setInterval(function () {
    $("#code").html(JSON.stringify(configuration, null, 2));
    if(configuration != null && configuration != undefined)
        localStorage.configuration = JSON.stringify(configuration);
}, 1000);