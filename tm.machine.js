function Machine() {
    var self = this;
    this.tape = new Tape();
    $('.tape-input').keydown(function() {
        if(self.running) {
            self.reset();
            self.running = false;
        }
    });
    this.reset();
}

Machine.prototype.reset = function() {
    this.running = false;
    this.setConfiguration();
    this.currentState = this.configuration.startState;
    this.tape.reset();
}



Machine.prototype.calcStep = function() {
    this.running = true;
    var step = this.configuration.states[this.currentState].connections[this.tape.read()];
    if(step) {
        this.tape.write(step.write);
        this.tape.move(step.move == 'L' ? -1 : 1);
        this.currentState = step.newState;
    } else {
        this.tape.setFinished(this.currentState.accepted);
        return this.currentState.accepted;
    }

}


Machine.prototype.setConfiguration = function() {
    this.configuration = {
        states: {
            'q0': {
                connections: {
                    '0': {
                        write: '1',
                        move: 'L',
                        newState: 'q1'
                    },
                    '1': {
                        write: '0',
                        move: 'L',
                        newState: 'q0'
                    }
                },
                accepted: true
            }
        },
        startState: 'q0'
    };
}