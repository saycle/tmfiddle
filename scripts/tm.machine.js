function Machine() {
    var self = this;
    this.tape = new Tape(this);
    this.reset();
    this.tape.move(null, 0);
}

Machine.prototype.reset = function() {
    this.stop();
    this.result = null;
    this.setConfiguration();
    this.currentState = this.configuration.startState;
    this.tape.reset();
}

Machine.prototype.stop = function() {
    clearInterval(this.calculationInterval);
    this.calculationInterval = null;
    this.running = false;
}

Machine.prototype.calculateAll = function(interval) {
    var self = this;
    this.calculationInterval = setInterval(function(){
        self.calculateStep();
    }, interval);
}

Machine.prototype.calculateStep = function() {
    this.running = true;
    if(!this.configuration) {
        this.setConfiguration();
    }
    var step = this.configuration.states[this.currentState].connections[this.tape.read()];
    if(step) {
        this.tape.write(step.write);
        this.tape.move(step.move == 'L' ? -1 : step.move == 'R' ? 1 : 0);
        this.currentState = step.newState;
    } else {
        this.tape.setFinished(this.configuration.states[this.currentState].accepted);
        this.stop();
        this.result = this.currentState.accepted;
        return this.result;
    }
    return null;
}

Machine.prototype.setConfiguration = function() {
    this.configuration = configuration;
}