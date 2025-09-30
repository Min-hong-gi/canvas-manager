export function deg(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return Math.PI / 180 * val;
}
/**
 * MilliNumber
 * @param strings
 * @param values
 * @returns
 */
export function mn(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return val / 1000;
}
/**
 * Second To MiliSecond
 * @param strings
 * @param values
 * @returns
 */
export function sec(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return val * 1000;
}
/**
 * Minit To MiliSecond
 * @param strings
 * @param values
 * @returns
 */
export function minute(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return val * 1000 * 60;
}
/**
 * Hour To MiliSecond
 * @param strings
 * @param values
 * @returns
 */
export function hour(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return val * 1000 * 60 * 60;
}
/**
 * Random
 */
export function rand(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
export function between(a, b) {
    return function (val) {
        return lessEq(b)(val) && greaterEq(a)(val);
    };
}
export function lessEq(a) {
    return function (val) {
        return a >= val;
    };
}
export function greaterEq(a) {
    return function (val) {
        return a <= val;
    };
}
