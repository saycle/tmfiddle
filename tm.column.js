function Column() {
}

Column.prototype.read = function() {
    return this.input.val();
}
Column.prototype.write = function(value) {
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