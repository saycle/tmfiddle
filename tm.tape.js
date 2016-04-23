var configuration = {
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
					move: 'R',
					newState: 'q0'
				}
			},
			accepted: true
		}
	},
	startState: 'q0'
};


function Tape() {
	this.columns = [];
    this.input = "";
    this.readerWriter = [];
}

Tape.prototype.getInput = function() {
    var input = "";
    this.columns.forEach(function(column) {
        input += column.read();
    });
    this.input = input.trim();
    return this.input;
}

Tape.prototype.moveReaderWriter = function(move) {
    if(!move) {
        this.readerWriter.index = 0;
    } else {
        switch(move) {
            case -1:
                if(this.readerWriter.index > 0) {
                    this.readerWriter.index--;
                }
                break;
            case 1:
                if(this.readerWriter.index < this.columns.length - 1) {
                    this.readerWriter.index++;
                }
                break;
        }
    }
    if(this.readerWriter.pointer) {
        this.readerWriter.pointer.deactivate();
    }
    this.readerWriter.pointer = this.columns[this.readerWriter.index];
    this.readerWriter.pointer.activate();
}

Tape.prototype.addColumn = function(prepend) {
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
		maxlength: '1'
	});
    column.input.keyup(function() {
		if($(this).parent().parent().is(':last-child')) {
			tape.addColumn();
		}
		if($(this).parent().parent().prev().is(':first-child')) {
			tape.addColumn(true);
		}
	});
    column.readerwriterCell =  $('<div/>', {
		class: 'tape-readerwriter-cell'
	});
	if(prepend) {
		$("#tape").prepend(column.getMarkup());
	} else {
		$("#tape").append(column.getMarkup());
	}
	this.columns.push(column);
	$('.tape-input').autotab({ maxlength: 1 });
}
