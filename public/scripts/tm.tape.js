function Tape(machine) {
    this.machine = machine;
    this.clear();
}

Tape.prototype.getInput = function() {
    var input = "";
    this.columns.forEach(function(column) {
        input += column.read();
    });
    this.input = input.trim();
    return this.input;
};

Tape.prototype.move = function(move) {
    switch(move) {
        case -1:
            if(this.readerWriter.index > 0) {
                this.readerWriter.index--;
            }
            break;
        case 0:
            break;
        case 1:
            if(this.readerWriter.index < this.columns.length - 1) {
                this.readerWriter.index++;
            }
            break;
    }
    var content = false;
    if(this.readerWriter.pointer) {
        content = this.readerWriter.pointer.deactivate();
    }
    this.readerWriter.pointer = this.columns[this.readerWriter.index];
    this.readerWriter.pointer.activate(content);
};

Tape.prototype.position = function(position) {
    this.readerWriter.index = position;
    this.move();
};

Tape.prototype.read = function() {
	return this.readerWriter.pointer.read();
};

Tape.prototype.write = function(value) {
	this.readerWriter.pointer.write(value, this, false);
};

Tape.prototype.setFinished = function(status) {
    this.removeOverflow();
    this.columns.forEach(function(column) {
        column.inputCell.addClass(status ? 'accepted' : 'failed');
    });
};

Tape.prototype.reset = function() {
    this.columns.forEach(function (column) {
        column.inputCell.removeClass('accepted');
        column.inputCell.removeClass('failed');
    });
    this.position(1);
};

Tape.prototype.clear = function() {
    if(this.columns) {
        this.columns.forEach(function(column) {
            column.element.remove();
        });
    }
    this.columns = [];
    this.input = "";
    this.readerWriter = [];
    this.addColumn();
    this.addColumn();
    this.position(0);
};

Tape.prototype.addColumn = function(prepend) {
    var self = this;
    var column = new Column();
	column.element =  $('<div/>', {
		id: 'tape-column-' + this.columns.length,
		class: 'tape-column'
	});
    column.inputCell =  $('<div/>', {
		class: 'tape-input-cell'
	});
    column.input = $('<input/>', {
		type: 'text',
		class: 'tape-input',
		type: 'text',
        value: ' ',
		maxlength: '1'
	});
    column.input.keypress(function(e) {
        column.write(e.key, self, true);
	});
    column.readerwriterCell =  $('<div/>', {
		class: 'tape-readerwriter-cell'
	});
	if(prepend) {
		$("#tape").prepend(column.getMarkup());
		this.columns.unshift(column);
        this.position(1);
	} else {
		$("#tape").append(column.getMarkup());
		this.columns.push(column);
	}
	$('.tape-input').autotab({ maxlength: 1 });
};

Tape.prototype.removeOverflow = function () {
    var remove = true;
    var index = 0;
    while(remove) {
        if(this.columns.length > 2 && this.columns[index].read() == ' ' && this.columns[index + 1].read() == ' ') {
            this.columns[index].element.remove();
            this.columns = this.columns.slice(1);
        } else {
            remove = false;
        }
    }
};

Tape.prototype.run = function() {
    if(this.readerWriter) {
        this.readerWriter.pointer.run();
    }
};

Tape.prototype.stop = function() {
    if(this.readerWriter) {
        this.readerWriter.pointer.stop();
    }

};
