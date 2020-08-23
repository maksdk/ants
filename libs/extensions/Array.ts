interface Array<T> {
    first: () => T;
    last: () => T;
    random: () => T;
}

Array.prototype.first = function () {
    return this[0];
};

Array.prototype.last = function () {
    return this[this.length - 1];
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};