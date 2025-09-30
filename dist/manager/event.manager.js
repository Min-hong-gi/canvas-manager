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
var _EventManager_instances, _EventManager_hoverdElements, _EventManager_lastEvent, _EventManager_events, _EventManager_subscribers, _EventManager_searchTree, _EventManager_canvas, _EventManager_updateobjs;
import { Quadtree } from "../helper/quadtree.entity.js";
export function canvasEventTargetFactory(target) {
    return new class extends CanvasEventTarget {
        constructor() {
            super(...arguments);
            this.hasInside = target.hasInside;
        }
    };
}
export class CanvasEventTarget extends EventTarget {
    constructor() {
        super(...arguments);
        this.__hover = false;
    }
    getBoundBox(...args) {
        return {
            x: -5000,
            y: -5000,
            width: 100000,
            height: 100000,
        };
    }
}
export class EventManager {
    constructor(canvas) {
        _EventManager_instances.add(this);
        _EventManager_hoverdElements.set(this, new Set());
        _EventManager_lastEvent.set(this, null);
        _EventManager_events.set(this, []);
        _EventManager_subscribers.set(this, {});
        _EventManager_searchTree.set(this, void 0);
        _EventManager_canvas.set(this, void 0);
        this.scale = 0;
        __classPrivateFieldSet(this, _EventManager_canvas, canvas, "f");
        __classPrivateFieldSet(this, _EventManager_searchTree, new Quadtree({
            x: 0,
            y: 0,
            width: __classPrivateFieldGet(this, _EventManager_canvas, "f").width,
            height: __classPrivateFieldGet(this, _EventManager_canvas, "f").height,
        }), "f");
        // 객체 관리 효율성을 위한 좌표 추적용 구독
        let a = canvasEventTargetFactory({
            hasInside(x, y) {
                return true;
            }
        });
        this.subscribe(a);
        a.addEventListener('pointermove', () => { });
    }
    subscribe(target) {
        const origin = target.addEventListener.bind(target);
        target.addEventListener = (type, callback, options) => {
            if (!__classPrivateFieldGet(this, _EventManager_events, "f").includes(type)) {
                __classPrivateFieldGet(this, _EventManager_events, "f").push(type);
                __classPrivateFieldGet(this, _EventManager_canvas, "f").addEventListener(type, (event) => {
                    this.dispatch(new event.constructor(event.type, event));
                });
            }
            if (!__classPrivateFieldGet(this, _EventManager_subscribers, "f")[type]) {
                __classPrivateFieldGet(this, _EventManager_subscribers, "f")[type] = [];
            }
            if (!__classPrivateFieldGet(this, _EventManager_searchTree, "f").query(target.getBoundBox()).includes(target)) {
                __classPrivateFieldGet(this, _EventManager_searchTree, "f").insert(target, true);
            }
            __classPrivateFieldGet(this, _EventManager_subscribers, "f")[type].push(target);
            origin(type, callback, options);
        };
    }
    unsubscribe(target) {
        const keys = __classPrivateFieldGet(this, _EventManager_events, "f");
        for (const event of keys) {
            const index = __classPrivateFieldGet(this, _EventManager_subscribers, "f")[event].indexOf(target);
            __classPrivateFieldGet(this, _EventManager_subscribers, "f")[event].splice(index, 1);
        }
        __classPrivateFieldGet(this, _EventManager_searchTree, "f").remove(target);
    }
    /**
     * 이벤트 적용
     * @param event Event를 관리 객체들에 전파합니다.
     * @throws MouseEvent의 경우 hasInside 여부에 따라 전파됩니다. 이를 무시하기 위해서는 수신 객체에 직접 dispatch해야 합니다.
     */
    dispatch(event) {
        var _a, _b;
        if (event instanceof MouseEvent) {
            const cx = (((_a = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _a === void 0 ? void 0 : _a.clientX) || 0) * this.scale;
            const cy = (((_b = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _b === void 0 ? void 0 : _b.clientY) || 0) * this.scale;
            __classPrivateFieldSet(this, _EventManager_lastEvent, event, "f");
            const targets = __classPrivateFieldGet(this, _EventManager_searchTree, "f").query({ x: cx, y: cy, width: 1, height: 1 });
            targets.forEach(x => {
                if (x.hasInside(cx, cy)) {
                    x.dispatchEvent(event);
                }
            });
        }
        else {
            __classPrivateFieldGet(this, _EventManager_searchTree, "f").allItems().forEach(x => {
                x.dispatchEvent(event);
            });
        }
    }
    /**
     * mouse leave 및 mouse out등의 실시간 정보 갱신이 필요할 경우 실시간 호출 필요
     */
    update() {
        var _a, _b;
        __classPrivateFieldGet(this, _EventManager_searchTree, "f").update();
        let temp = new Set();
        const lx = (((_a = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _a === void 0 ? void 0 : _a.x) || 0) * this.scale;
        const ly = (((_b = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _b === void 0 ? void 0 : _b.y) || 0) * this.scale;
        if (__classPrivateFieldGet(this, _EventManager_lastEvent, "f")) {
            const targets = __classPrivateFieldGet(this, _EventManager_searchTree, "f").query({ x: lx, y: ly, width: 1, height: 1 });
            __classPrivateFieldGet(this, _EventManager_hoverdElements, "f").forEach(x => {
                __classPrivateFieldGet(this, _EventManager_instances, "m", _EventManager_updateobjs).call(this, x);
                if (x.__hover) {
                    temp.add(x);
                }
            });
            targets === null || targets === void 0 ? void 0 : targets.forEach(x => {
                __classPrivateFieldGet(this, _EventManager_instances, "m", _EventManager_updateobjs).call(this, x);
                if (x.__hover) {
                    temp.add(x);
                }
            });
        }
        __classPrivateFieldSet(this, _EventManager_hoverdElements, temp, "f");
    }
    /**
     * 디버깅용 제거 예정
     * @param ctx
     */
    render(ctx) {
        var _a, _b;
        __classPrivateFieldGet(this, _EventManager_searchTree, "f").update();
        __classPrivateFieldGet(this, _EventManager_searchTree, "f").render(ctx, '#0f0');
        const lx = (((_a = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _a === void 0 ? void 0 : _a.x) || 0) * this.scale;
        const ly = (((_b = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _b === void 0 ? void 0 : _b.y) || 0) * this.scale;
        ctx.beginPath();
        ctx.arc(lx, ly, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}
_EventManager_hoverdElements = new WeakMap(), _EventManager_lastEvent = new WeakMap(), _EventManager_events = new WeakMap(), _EventManager_subscribers = new WeakMap(), _EventManager_searchTree = new WeakMap(), _EventManager_canvas = new WeakMap(), _EventManager_instances = new WeakSet(), _EventManager_updateobjs = function _EventManager_updateobjs(x) {
    var _a, _b;
    const cx = (((_a = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _a === void 0 ? void 0 : _a.clientX) || 0) * this.scale;
    const cy = (((_b = __classPrivateFieldGet(this, _EventManager_lastEvent, "f")) === null || _b === void 0 ? void 0 : _b.clientY) || 0) * this.scale;
    if (x.__hover && !x.hasInside(cx || NaN, cy || NaN)) {
        let leave = new MouseEvent('mouseleave', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        let out = new MouseEvent('mouseout', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        x.dispatchEvent(leave);
        x.dispatchEvent(out);
        let pleave = new PointerEvent('pointerleave', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        let pout = new PointerEvent('pointerout', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        x.dispatchEvent(pleave);
        x.dispatchEvent(pout);
        x.__hover = false;
    }
    else if (!x.__hover && x.hasInside(cx || NaN, cy || NaN)) {
        let enter = new PointerEvent('mouseenter', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        let over = new PointerEvent('mouseover', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        x.dispatchEvent(enter);
        x.dispatchEvent(over);
        let penter = new PointerEvent('pointerenter', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        let pover = new PointerEvent('pointerover', __classPrivateFieldGet(this, _EventManager_lastEvent, "f") || undefined);
        x.dispatchEvent(penter);
        x.dispatchEvent(pover);
        x.__hover = true;
    }
};
export function eventDecoratorFactory(canvasManager) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                this.hasInside = constructor.prototype.hasInside;
                canvasManager.subscribe(this);
            }
        };
    };
}
