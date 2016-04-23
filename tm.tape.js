function Tape() {
	this.columns = [];
    this.input = "";
    this.readerWriter = [];
    this.addColumn();
    this.addColumn();
    this.move();
}

Tape.prototype.getInput = function() {
    var input = "";
    this.columns.forEach(function(column) {
        input += column.read();
    });
    this.input = input.trim();
    return this.input;
}

Tape.prototype.move = function(move) {
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

Tape.prototype.read = function() {
	return this.readerWriter.pointer.read();
}

Tape.prototype.write = function(value) {
	this.readerWriter.pointer.write(value);
}

Tape.prototype.setFinished = function(status) {
    this.columns.forEach(function(column) {
        column.inputCell.addClass(status ? 'accepted' : 'failed');
    });
}

Tape.prototype.reset = function() {
    this.columns.forEach(function(column) {
        column.inputCell.removeClass('accepted');
        column.inputCell.removeClass('failed');
    });
}

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
		maxlength: '1'
	});
    column.input.keydown(function(e) {
        if($(this).parent().parent().is(':last-child')) {
            self.addColumn();
		}
		if($(this).parent().parent().is(':first-child')) {
            self.addColumn(true);
            $.autotab.previous();
		}
        column.write(String.fromCharCode(e.which));
	});
    column.readerwriterCell =  $('<div/>', {
		class: 'tape-readerwriter-cell'
	});
	if(prepend) {
		$("#tape").prepend(column.getMarkup());
		this.columns.unshift(column);
		this.readerWriter.index++;
	} else {
		$("#tape").append(column.getMarkup());
		this.columns.push(column);
	}
	$('.tape-input').autotab({ maxlength: 1 });
}
