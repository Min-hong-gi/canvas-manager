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
var _Vector2D_x, _Vector2D_y;
export class Vector2D {
    constructor(x, y) {
        _Vector2D_x.set(this, void 0);
        _Vector2D_y.set(this, void 0);
        __classPrivateFieldSet(this, _Vector2D_x, x, "f");
        __classPrivateFieldSet(this, _Vector2D_y, y, "f");
    }
    get x() {
        return __classPrivateFieldGet(this, _Vector2D_x, "f");
    }
    get y() {
        return __classPrivateFieldGet(this, _Vector2D_y, "f");
    }
}
_Vector2D_x = new WeakMap(), _Vector2D_y = new WeakMap();
