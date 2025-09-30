import { rotateDot, toAbsolute } from "../util/vector.utils.js";

/**
 * 원점을 기준으로 반지름 크기의 원을 반환
 * @param dot 원점
 * @param radius 반지름
 */
export function toShape(dot: number[], radius: number): Path2D;
/**
 * 각 점들을 이은 다각형을 반환
 * @param dots 점들
 * @param rotate 회전각
 * @param base 회전축
 * @param options relative = 회전축 기준의 상대좌표 처리 여부
 * @default
 * rotate 0
 * base [0, 0]
 * options { relative: false }
 */
export function toShape(dots: number[][], rotate?: number, base?: number[], options?: { relative?: boolean }): Path2D;
/**
 * 각 점들을 이은 다각형을 반환
 * @param dots 점들
 * @param rotate 회전각
 * @param base 회전축
 * @param options relative = 회전축 기준의 상대좌표 처리 여부
 * @default
 * rotate 0
 * base {x: 0, y: 0}
 * options { relative: false }
 */
export function toShape(dots: { x: number, y: number }[], rotate?: number, base?: { x: number, y: number }, options?: { relative?: boolean }): Path2D;
/**
 * 각 점들을 이은 다각형을 반환
 */
export function toShape(
    dots: number[][] | { x: number, y: number }[] | number[],
    rotate: number = 0,
    base?: number[] | { x: number, y: number },
    options?: { relative?: boolean }
): Path2D {
    const path = new Path2D();
    let bx = 0, by = 0;
    if (base) {
        if (Array.isArray(base)) {
            [bx, by] = base;
        } else {
            ({ x: bx, y: by } = base);
        }
    }

    // 원(arc) 처리
    if (Array.isArray(dots) && typeof dots[0] === "number") {
        const [x, y] = dots as number[];
        path.arc(x, y, rotate, 0, Math.PI * 2);
        return path;
    }

    // dots가 number[][]인지 {x, y}[]인지 판별
    let isArrayForm = Array.isArray(dots[0]);
    const points = dots as (number[] | { x: number, y: number })[];

    // 첫 점 이동
    let x0: number, y0: number;
    if (isArrayForm) {
        [x0, y0] = points[0] as number[];
    } else {
        ({ x: x0, y: y0 } = points[0] as { x: number, y: number });
    }
    if (options?.relative) {
        [x0, y0] = toAbsolute([x0, y0], [bx, by]);
    }
    let [mx, my] = rotateDot([x0, y0], rotate, [bx, by]);
    path.moveTo(mx, my);

    // 나머지 점들
    for (let i = 1; i < points.length; i++) {
        let x: number, y: number;
        if (isArrayForm) {
            [x, y] = points[i] as number[];
        } else {
            ({ x, y } = points[i] as { x: number, y: number });
        }
        if (options?.relative) {
            [x, y] = toAbsolute([x, y], [bx, by]);
        }
        const [rx, ry] = rotateDot([x, y], rotate, [bx, by]);
        path.lineTo(rx, ry);
    }

    path.closePath();
    return path;
}