function Column() {
}

Column.prototype.read = function() {
    var value = this.input.val();
    return value === "" ? " " : value;
};

Column.prototype.write = function(value, tape, interupt, next) {
    if($(this.element).is(':last-child')) {
        if(!next || next == 'R') {
            tape.addColumn();
        }
    }
    if($(this.element).is(':first-child')) {
        if(!next || next == 'L') {
            tape.addColumn(true);
            $.autotab.previous();
        }
    }
    if(interupt) {
        self.machine.reset();
    }
    this.input.val(value);
};

Column.prototype.activate = function() {
    this.readerwriterCell.addClass('active');
};

Column.prototype.deactivate = function() {
    this.readerwriterCell.removeClass('active');
};

Column.prototype.getMarkup = function() {
    return this.element.append(this.inputCell.append(this.input)).append(this.readerwriterCell);
};