function Column() {
}

Column.prototype.read = function() {
    var value = this.input.val();
    return value === "" ? " " : value;
}
Column.prototype.write = function(value, tape, interupt) {
    if(tape.machine.running && interupt) {
        self.machine.reset();
    }
    if($(this.element).is(':last-child')) {
        tape.addColumn();
    }
    if($(this.element).is(':first-child')) {
        tape.addColumn(true);
        $.autotab.previous();
    }
    this.input.val(value);
}
Column.prototype.activate = function() {
    this.readerwriterCell.addClass('active');
}
Column.prototype.deactivate = function() {
    this.readerwriterCell.removeClass('active');
}
Column.prototype.getMarkup = function() {
    return this.element.append(this.inputCell.append(this.input)).append(this.readerwriterCell);
}