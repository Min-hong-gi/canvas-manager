export class Unit extends Number {
    static wrap(value) {
        return new Unit(value);
    }
    get crisp() {
        return Math.floor(this.valueOf());
    }
    valueOf() {
        return super.valueOf();
    }
    [Symbol.toPrimitive](hint) {
        if (hint === 'number') {
            return this.valueOf();
        }
        return this.valueOf();
    }
}
