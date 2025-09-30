var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CanvasManager_scale, _CanvasManager_canvas, _CanvasManager_ctx;
import { Unit } from "../unit/unit.number.js";
import { parseTemplate } from "../util/common.utils.js";
export class CanvasManager {
    constructor(canvas, options) {
        _CanvasManager_scale.set(this, void 0);
        _CanvasManager_canvas.set(this, void 0);
        _CanvasManager_ctx.set(this, void 0);
        /**
         * ViewWidth'
         * canvasWidth의 상대 크기 - %로 계산 100 = 100%
         * @param strings
         * @param values
         * @returns
         * @example
         * +vw`100`
         * vw`100`.crisp
         */
        this.vw = (strings, ...values) => {
            let val = parseTemplate(strings, values);
            return Unit.wrap(this.canvasWidth / 100 * val);
        };
        /**
         * ViewHeight'
         * canvasHeight의 상대 크기 - %로 계산 100 = 100%
         * @param strings
         * @param values
         * @returns
         * @example
         * +vh`100`
         * vh`100`.crisp
         */
        this.vh = (strings, ...values) => {
            let val = parseTemplate(strings, values);
            return Unit.wrap(this.canvasHeight / 100 * val);
        };
        /**
         * ReverseWidth'
         * 반전 좌표계 계산 px 단위 -  0 = canvasWidth
         * @param strings
         * @param values
         * @returns
         * @example
         * +rw`100`
         * rw`100`.crisp
         */
        this.rw = (strings, ...values) => {
            let val = parseTemplate(strings, values);
            return Unit.wrap(this.canvasWidth - val);
        };
        /**
         * ReverseHeight'
         * 반전 좌표계 계산 px 단위 -  0 = canvasHeight
         * @param strings
         * @param values
         * @returns
         * @example
         * +rh`100`
         * rh`100`.crisp
         */
        this.rh = (strings, ...values) => {
            let val = parseTemplate(strings, values);
            return Unit.wrap(this.canvasHeight - val);
        };
        __classPrivateFieldSet(this, _CanvasManager_canvas, canvas, "f");
        __classPrivateFieldSet(this, _CanvasManager_scale, 1, "f");
        let ctx = canvas.getContext('2d', options);
        if (!ctx) {
            throw new Error(`Fail get context 2D`);
        }
        __classPrivateFieldSet(this, _CanvasManager_ctx, ctx, "f");
    }
    get canvasWidth() {
        return __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width;
    }
    get canvasHeight() {
        return __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height;
    }
    set scale(scale) {
        __classPrivateFieldGet(this, _CanvasManager_ctx, "f").scale(scale, scale);
        __classPrivateFieldSet(this, _CanvasManager_scale, scale, "f");
    }
    get scale() {
        return __classPrivateFieldGet(this, _CanvasManager_scale, "f");
    }
    draw(drawFn, { pathable, saveState } = { pathable: true, saveState: true }) {
        if (saveState) {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").save();
        }
        if (pathable) {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").beginPath();
        }
        const temp = drawFn(__classPrivateFieldGet(this, _CanvasManager_ctx, "f"), this);
        if (pathable) {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").closePath();
        }
        if (saveState) {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").restore();
        }
        return temp;
    }
    state(drawFn) {
        return drawFn(__classPrivateFieldGet(this, _CanvasManager_ctx, "f"), this);
    }
    clear(width, height) {
        if (width && height) {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").clearRect(0, 0, width, height);
        }
        else {
            __classPrivateFieldGet(this, _CanvasManager_ctx, "f").clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
    resize(width, height) {
        if (width) {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width = width * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        }
        else {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width = __classPrivateFieldGet(this, _CanvasManager_canvas, "f").clientWidth * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        }
        if (height) {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height = height * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        }
        else {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height = __classPrivateFieldGet(this, _CanvasManager_canvas, "f").clientHeight * __classPrivateFieldGet(this, _CanvasManager_scale, "f");
        }
    }
    isPointInPath(shape, x, y) {
        return __classPrivateFieldGet(this, _CanvasManager_ctx, "f").isPointInPath(shape, x, y);
    }
    isStrokeInPath(shape, x, y) {
        return __classPrivateFieldGet(this, _CanvasManager_ctx, "f").isPointInStroke(shape, x, y);
    }
}
_CanvasManager_scale = new WeakMap(), _CanvasManager_canvas = new WeakMap(), _CanvasManager_ctx = new WeakMap();
