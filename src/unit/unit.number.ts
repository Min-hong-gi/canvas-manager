export class Unit extends Number {
    static wrap(value: string | number | boolean): Unit {
        return new Unit(value);
    }
    get crisp() {
        return Math.floor(this.valueOf()) + 0.5;
    }
    valueOf(): number {
        return super.valueOf();
    }
    [Symbol.toPrimitive](hint: string) {
        return this.valueOf();
    }
}
