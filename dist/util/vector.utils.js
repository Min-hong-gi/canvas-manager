function getVectorInfo(vector) {
    if (Array.isArray(vector)) {
        return {
            x: vector[0],
            y: vector[1],
        };
    }
    return {
        x: vector.x,
        y: vector.y,
    };
}
export function rotateDot(dot, rotate, base = [0, 0], options = { relative: false }) {
    const sin = Math.sin(rotate);
    const cos = Math.cos(rotate);
    let { x: bx, y: by } = getVectorInfo(base);
    let { x, y } = getVectorInfo(dot);
    if (options === null || options === void 0 ? void 0 : options.relative) {
        [x, y] = toAbsolute([x, y], [bx, by]);
    }
    let mx = bx + (x - bx) * cos - (y - by) * sin;
    let my = by + (x - bx) * sin + (y - by) * cos;
    return Array.isArray(dot) ? [mx, my] : { x: mx, y: my };
}
export function toAbsolute(dots, base) {
    const { x: bx, y: by } = getVectorInfo(base);
    if (Array.isArray(dots) && Array.isArray(dots[0])) {
        const points = dots;
        return points.map(dot => [dot[0] + bx, dot[1] + by]);
    }
    else if (Array.isArray(dots) && typeof dots[0] == 'object') {
        const points = dots;
        return points.map(dot => ({ x: dot.x + bx, y: dot.y + by }));
    }
    else {
        const { x, y } = getVectorInfo(dots);
        if (Array.isArray(dots)) {
            return [x + bx, y + by];
        }
        return { x: x + bx, y: y + by };
    }
}
export function dot(a, b) {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);
    return ax * bx + ay * by;
}
export function subtract(a, b) {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);
    if (Array.isArray(a)) {
        return [ax - bx, ay - by];
    }
    return { x: ax - bx, y: ay - by };
}
export function multiply(a, scalar) {
    let { x: ax, y: ay } = getVectorInfo(a);
    if (Array.isArray(a)) {
        return [ax * scalar, ay * scalar];
    }
    return { x: ax * scalar, y: ay * scalar };
}
export function add(a, b) {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);
    if (Array.isArray(a)) {
        return [ax + bx, ay + by];
    }
    return { x: ax + bx, y: ay + by };
}
export function normalize(v) {
    const { x, y } = getVectorInfo(v);
    if (Array.isArray(v)) {
        const vLen = len(v);
        return vLen === 0 ? [0, 0] : [x / vLen, y / vLen];
    }
    else {
        const vLen = len(v);
        return vLen === 0 ? { x: 0, y: 0 } : { x: x / vLen, y: y / vLen };
    }
}
export function len(v) {
    const { x, y } = getVectorInfo(v);
    return Math.sqrt(x * x + y * y);
}
export function resolveCollision(a, b) {
    // 1. 노멀 벡터
    const n = subtract(getVectorInfo(b.pos), getVectorInfo(a.pos));
    const un = normalize(n);
    // 2. 접선 벡터
    const ut = un;
    // 3. 속도를 노멀/접선으로 분리
    const v1n = dot(getVectorInfo(a.vel), un);
    const v1t = dot(getVectorInfo(a.vel), ut);
    const v2n = dot(getVectorInfo(b.vel), un);
    // 4. 노멀 속도 계산 (1차원 탄성 충돌)
    const v1nAfter = (v1n * (a.mass - b.mass) + 2 * b.mass * v2n) / (a.mass + b.mass);
    let { x, y } = add(multiply(un, v1nAfter), multiply(ut, v1t));
    if (Array.isArray(a.pos)) {
        return [x, y];
    }
    return { x, y };
}
