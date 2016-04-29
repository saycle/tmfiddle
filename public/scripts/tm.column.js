function Column() {
}

Column.prototype.read = function () {
    var value = this.input.val();
    return value === "" ? " " : value;
};

Column.prototype.write = function (value, tape, interupt) {
    if ($(this.element).is(':last-child')) {
        tape.addColumn();
    }
    if ($(this.element).is(':first-child')) {
        tape.addColumn(true);
        $.autotab.previous();
    }
    if (interupt) {
        self.machine.reset();
    }
    this.input.val(value);
};

Column.prototype.activate = function (content) {
    this.readerwriterCell.addClass('active');
    if (content) {
        this.readerwriterCell.html(content);

    } else {
        this.readerwriterCell.html('<div id="readerWriter">' +
            '    <i id="readerWriter-wheel-left" class="readerWriter wheel fa fa-gear faa-slow animated"></i>' +
            '    <span id="readerWriter-wheel-body" class="readerWriter"></span>' +
            '    <i id="readerWriter-wheel-right" class="readerWriter wheel fa fa-gear faa-slow animated"></i>' +
            '</div>');
    }
};

Column.prototype.deactivate = function () {
    this.readerwriterCell.removeClass('active');
    var content = this.readerwriterCell.html();
    this.readerwriterCell.html('');
    return content;
};

Column.prototype.run = function () {
    this.readerwriterCell.find(".wheel").addClass('faa-spin');
};

Column.prototype.stop = function () {
    this.readerwriterCell.find(".wheel").removeClass('faa-spin');
};

Column.prototype.getMarkup = function () {
    return this.element.append(this.inputCell.append(this.input)).append(this.readerwriterCell);
};