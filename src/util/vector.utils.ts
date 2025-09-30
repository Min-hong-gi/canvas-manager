type Vector2D = number[] | { x: number, y: number };

function getVectorInfo(vector: Vector2D): { x: number; y: number } {
    if (Array.isArray(vector)) {
        return {
            x: vector[0],
            y: vector[1],
        }
    }
    return {
        x: vector.x,
        y: vector.y,
    }
}
/**
 * 
 * @param dot 상대 좌표
 * @param rotate 회전값 radian
 * @param base 회전축
 * @param options relative 회전축기준 상대 좌표 여부
 * @default base 0,0
 */
export function rotateDot(dot: number[], rotate: number, base?: number[], options?: { relative?: boolean }): number[];
export function rotateDot(dot: { x: number, y: number }, rotate: number, base?: { x: number, y: number }, options?: { relative?: boolean }): { x: number, y: number };
export function rotateDot(
    dot: Vector2D,
    rotate: number, base: Vector2D = [0, 0],
    options: { relative?: boolean } = { relative: false }
) {
    const sin = Math.sin(rotate);
    const cos = Math.cos(rotate);

    let { x: bx, y: by } = getVectorInfo(base);
    let { x, y } = getVectorInfo(dot);
    if (options?.relative) {
        [x, y] = toAbsolute([x, y], [bx, by]);
    }

    let mx = bx + (x - bx) * cos - (y - by) * sin;
    let my = by + (x - bx) * sin + (y - by) * cos;

    return Array.isArray(dot) ? [mx, my] : { x: mx, y: my };
}

/**
 * 기본 좌표에 따른 상대 좌표를 절대 좌표로 변환
 */
export function toAbsolute(dot: number[], base: number[]): number[];
export function toAbsolute(dot: { x: number, y: number }, base: number[]): { x: number, y: number };
export function toAbsolute(dots: number[][], base: number[]): number[][];
export function toAbsolute(dots: { x: number, y: number }[], base: { x: number, y: number }): { x: number, y: number }[];
export function toAbsolute(
    dots: number[][] | { x: number, y: number }[] | { x: number, y: number } | number[],
    base: Vector2D
): number[][] | { x: number, y: number }[] | Vector2D {
    const { x: bx, y: by } = getVectorInfo(base);
    if (Array.isArray(dots) && Array.isArray(dots[0])) {
        const points = dots as number[][];
        return points.map(dot => [dot[0] + bx, dot[1] + by]);
    } else if (Array.isArray(dots) && typeof dots[0] == 'object') {
        const points = dots as { x: number, y: number }[];
        return points.map(dot => ({ x: dot.x + bx, y: dot.y + by }));
    } else {
        const { x, y } = getVectorInfo((dots as number[] | { x: number, y: number }));
        if (Array.isArray(dots)) {
            return [x + bx, y + by];
        }
        return { x: x + bx, y: y + by };
    }
}
// 2D 벡터 연산

/**
 * 두 벡터의 내적
 * @param a 
 * @param b 
 */
export function dot(a: number[], b: number[]): number;
export function dot(a: { x: number, y: number }, b: { x: number, y: number }): number;
export function dot(a: Vector2D, b: Vector2D): number {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);
    return ax * bx + ay * by;
}

/**
 * a - b
 * @param a 
 * @param b 
 */
export function subtract(a: number[], b: number[]): number[];
export function subtract(a: { x: number, y: number }, b: { x: number, y: number }): { x: number, y: number };
export function subtract(a: Vector2D, b: Vector2D): Vector2D {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);

    if (Array.isArray(a)) {
        return [ax - bx, ay - by];
    }
    return { x: ax - bx, y: ay - by };
}

/**
 * a * scalar
 * @param a 
 * @param scalar 
 */
export function multiply(a: number[], scalar: number): number[];
export function multiply(a: { x: number, y: number }, scalar: number): { x: number, y: number };
export function multiply(a: Vector2D, scalar: number): Vector2D {
    let { x: ax, y: ay } = getVectorInfo(a);

    if (Array.isArray(a)) {
        return [ax * scalar, ay * scalar]
    }
    return { x: ax * scalar, y: ay * scalar };
}

/**
 * a + b
 * @param a 
 * @param b 
 */
export function add(a: number[], b: number[]): number[];
export function add(a: { x: number, y: number }, b: { x: number, y: number }): { x: number, y: number };
export function add(a: Vector2D, b: Vector2D): Vector2D {
    let { x: ax, y: ay } = getVectorInfo(a);
    let { x: bx, y: by } = getVectorInfo(b);

    if (Array.isArray(a)) {
        return [ax + bx, ay + by]
    }
    return { x: ax + bx, y: ay + by };
}

/**
 * 정규화
 * @param v
 */
export function normalize(v: number[]): number[];
export function normalize(v: { x: number, y: number }): { x: number, y: number };
export function normalize(v: Vector2D): Vector2D {
    const { x, y } = getVectorInfo(v);
    if (Array.isArray(v)) {
        const vLen = len(v);
        return vLen === 0 ? [0, 0] : [x / vLen, y / vLen];
    } else {
        const vLen = len(v);
        return vLen === 0 ? { x: 0, y: 0 } : { x: x / vLen, y: y / vLen };
    }
}

export function len(v: number[]): number;
export function len(v: {x: number, y: number}): number;
export function len(v: Vector2D) {
    const { x, y } = getVectorInfo(v);
    return Math.sqrt(x * x + y * y);
}

type ArrayBody = {
    pos: number[];
    vel: number[];
    mass: number;
}
type VectorBody = {
    pos: { x: number, y: number };
    vel: { x: number, y: number };
    mass: number;
}
/**
 * 두 백터의 충돌시 a의 속도
 * @param a 
 * @param b 
 */
export function resolveCollision(a: ArrayBody, b: ArrayBody): number[];
export function resolveCollision(a: VectorBody, b: VectorBody): { x: number, y: number };
export function resolveCollision(a: ArrayBody | VectorBody, b: ArrayBody | VectorBody): number[] | { x: number, y: number } {
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
