import { rotateDot, toAbsolute } from "../util/vector.utils.js";
/**
 * 각 점들을 이은 다각형을 반환
 */
export function toShape(dots, rotate = 0, base, options) {
    const path = new Path2D();
    let bx = 0, by = 0;
    if (base) {
        if (Array.isArray(base)) {
            [bx, by] = base;
        }
        else {
            ({ x: bx, y: by } = base);
        }
    }
    // 원(arc) 처리
    if (Array.isArray(dots) && typeof dots[0] === "number") {
        const [x, y] = dots;
        path.arc(x, y, rotate, 0, Math.PI * 2);
        return path;
    }
    // dots가 number[][]인지 {x, y}[]인지 판별
    let isArrayForm = Array.isArray(dots[0]);
    const points = dots;
    // 첫 점 이동
    let x0, y0;
    if (isArrayForm) {
        [x0, y0] = points[0];
    }
    else {
        ({ x: x0, y: y0 } = points[0]);
    }
    if (options === null || options === void 0 ? void 0 : options.relative) {
        [x0, y0] = toAbsolute([x0, y0], [bx, by]);
    }
    let [mx, my] = rotateDot([x0, y0], rotate, [bx, by]);
    path.moveTo(mx, my);
    // 나머지 점들
    for (let i = 1; i < points.length; i++) {
        let x, y;
        if (isArrayForm) {
            [x, y] = points[i];
        }
        else {
            ({ x, y } = points[i]);
        }
        if (options === null || options === void 0 ? void 0 : options.relative) {
            [x, y] = toAbsolute([x, y], [bx, by]);
        }
        const [rx, ry] = rotateDot([x, y], rotate, [bx, by]);
        path.lineTo(rx, ry);
    }
    path.closePath();
    return path;
}
