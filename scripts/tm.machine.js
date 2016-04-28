function Machine() {
    var self = this;
    this.tape = new Tape(this);
    this.reset();
    this.tape.position(0);
}

Machine.prototype.reset = function() {
    this.stop();
    this.result = null;
    this.setConfiguration();
    this.tape.reset();
    $(".w").removeClass("failed");
    $(".w").removeClass("accepted");
    this.setCurrentState(this.configuration.startState);
};

Machine.prototype.stop = function() {
    clearInterval(this.calculationInterval);
    this.calculationInterval = null;
    this.running = false;
};

Machine.prototype.calculateAll = function(interval) {
    var self = this;
    this.calculationInterval = setInterval(function(){
        self.calculateStep();
    }, interval);
};

Machine.prototype.calculateStep = function() {
    this.running = true;
    if(!this.configuration) {
        this.setConfiguration();
    }
    var step = this.configuration.states[this.currentState].connections[this.tape.read()];
    if(step) {
        this.tape.write(step.write, step.move);
        this.tape.move(step.move == 'L' ? -1 : step.move == 'R' ? 1 : 0);
        this.setCurrentState(step.newState);
    } else {
        return this.setFinished(this.configuration.states[this.currentState].accepted);
    }
    return null;
};

Machine.prototype.setCurrentState = function(newState) {
    $("#" + this.currentState).removeClass("active");
    this.currentState = newState;
    $("#" + this.currentState).addClass("active");
};

Machine.prototype.setFinished = function(status) {
    this.result = status;
    this.tape.setFinished(status);
    this.stop();
    $("#" + this.currentState).addClass(status ? "accepted" : "failed");
    return this.result;
}

Machine.prototype.setConfiguration = function() {
    this.configuration = configuration;
};