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
var _CanvasManager_canvas, _CanvasManager_ctx;
export class CanvasManager {
    constructor(canvas) {
        _CanvasManager_canvas.set(this, void 0);
        _CanvasManager_ctx.set(this, void 0);
        /**
         * String template를 통해 canvasWidth의 상대 크기를 계산
         * @param strings
         * @param values
         * @returns
         */
        this.wrp = (strings, ...values) => {
            let val;
            val = values[0];
            if (strings.length == 1) {
                val = new Number(strings[0]).valueOf();
            }
            return this.canvasWidth / 100 * val;
        };
        /**
         * String template를 통해 canvasHeight의 상대 크기를 계산
         * @param strings
         * @param values
         * @returns
         */
        this.hrp = (strings, ...values) => {
            let val;
            val = values[0];
            if (strings.length == 1) {
                val = new Number(strings[0]).valueOf();
            }
            return this.canvasHeight / 100 * val;
        };
        __classPrivateFieldSet(this, _CanvasManager_canvas, canvas, "f");
        __classPrivateFieldSet(this, _CanvasManager_ctx, canvas.getContext('2d'), "f");
    }
    get canvasWidth() {
        return __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width;
    }
    get canvasHeight() {
        return __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height;
    }
    draw(drawFn) {
        __classPrivateFieldGet(this, _CanvasManager_ctx, "f").beginPath();
        const temp = drawFn(__classPrivateFieldGet(this, _CanvasManager_ctx, "f"), this.canvasWidth, this.canvasHeight, this);
        __classPrivateFieldGet(this, _CanvasManager_ctx, "f").closePath();
        return temp;
    }
    resize(width, height) {
        if (width) {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width = width;
        }
        else {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").width = __classPrivateFieldGet(this, _CanvasManager_canvas, "f").clientWidth;
        }
        if (height) {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height = height;
        }
        else {
            __classPrivateFieldGet(this, _CanvasManager_canvas, "f").height = __classPrivateFieldGet(this, _CanvasManager_canvas, "f").clientHeight;
        }
    }
}
_CanvasManager_canvas = new WeakMap(), _CanvasManager_ctx = new WeakMap();
