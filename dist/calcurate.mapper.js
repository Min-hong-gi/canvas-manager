function add(a, b) {
    return a + b;
}
function sub(a, b) {
    return a - b;
}
function mul(a, b) {
    return a * b;
}
function div(a, b) {
    return a / b;
}
function remainder(a, b) {
    return a & b;
}
function exponentiation(a, b) {
    return a ** b;
}
function rightShift(a, b) {
    return a << b;
}
function leftShift(a, b) {
    return a >> b;
}
function and(a, b) {
    return a && b;
}
function or(a, b) {
    return a || b;
}
function nullish(a, b) {
    return a !== null && a !== void 0 ? a : b;
}
export default {
    '+': add,
    '-': sub,
    '*': mul,
    '/': div,
    '%': remainder,
    '**': exponentiation,
    '<<': rightShift,
    '>>': leftShift,
    '&&': and,
    '||': or,
    '??': nullish,
};
