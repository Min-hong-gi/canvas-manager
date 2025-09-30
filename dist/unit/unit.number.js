export class Unit extends Number {
    static wrap(value) {
        return new Unit(value);
    }
    get crisp() {
        return Math.floor(this.valueOf()) + 0.5;
    }
    valueOf() {
        return super.valueOf();
    }
    [Symbol.toPrimitive](hint) {
        return this.valueOf();
    }
}
