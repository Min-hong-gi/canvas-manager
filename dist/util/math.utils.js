/**
 * min ~ max 사이의 무작위 자연수 반환 (min, max 포함)
 */
export function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * a크거나 같으면서 b보다 작거나 같으면 true를 반환하는 함수를 반환
 * @param a 최소값
 * @param b 최대값
 * @returns
 */
export function between(a, b) {
    return function (val) {
        return lessEq(b)(val) && greaterEq(a)(val);
    };
}
/**
 * n 보다 작거나 같으면 true를 반환하는 함수를 반환
 * @param n 기준값
 * @returns
 */
export function lessEq(n) {
    return function (val) {
        return n >= val;
    };
}
/**
 * n 보다 크거나 같으면 true를 반환하는 함수를 반환
 * @param n 기준값
 * @returns
 */
export function greaterEq(n) {
    return function (val) {
        return n <= val;
    };
}
