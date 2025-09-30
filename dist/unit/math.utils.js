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
export function rotateDot(dot, rotate, base = [0, 0], options = { relative: false }) {
    const sin = Math.sin(rotate);
    const cos = Math.cos(rotate);
    let bx = 0, by = 0;
    if (base) {
        if (Array.isArray(base)) {
            [bx, by] = base;
        }
        else {
            ({ x: bx, y: by } = base);
        }
    }
    let [x, y] = Array.isArray(dot) ? dot : [dot.x, dot.y];
    if (options === null || options === void 0 ? void 0 : options.relative) {
        [x, y] = toAbsolute([x, y], [bx, by]);
    }
    let mx = bx + (x - bx) * cos - (y - by) * sin;
    let my = by + (x - bx) * sin + (y - by) * cos;
    return Array.isArray(dot) ? [mx, my] : { x: mx, y: my };
}
export function toAbsolute(dots, base) {
    if (Array.isArray(dots) && Array.isArray(dots[0])) {
        const points = dots;
        const basePoint = base;
        return points.map(dot => [dot[0] + basePoint[0], dot[1] + basePoint[1]]);
    }
    else if (Array.isArray(dots) && typeof dots[0] == 'object') {
        const points = dots;
        const basePoint = base;
        return points.map(dot => ({ x: dot.x + basePoint.x, y: dot.y + basePoint.y }));
    }
    else if (Array.isArray(dots) && typeof dots[0] == 'number') {
        const dot = dots;
        const basePoint = base;
        return [dot[0] + basePoint[0], dot[1] + basePoint[1]];
    }
    else if (typeof dots == 'object') {
        const dot = dots;
        const basePoint = base;
        return { x: dot.x + basePoint.x, y: dot.y + basePoint.y };
    }
    return [NaN, NaN];
}
