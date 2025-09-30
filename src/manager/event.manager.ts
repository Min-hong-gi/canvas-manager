import { BoundBox, HasBoundBox, Quadtree } from "../helper/quadtree.entity.js";

export function canvasEventTargetFactory(target: Pick<CanvasEventTarget, 'hasInside'>): CanvasEventTarget {
    return new class extends CanvasEventTarget {
        hasInside = target.hasInside;
    };
}

export abstract class CanvasEventTarget extends EventTarget implements HasBoundBox {
    __hover: boolean = false;
    abstract hasInside(x: number, y: number): boolean;
    getBoundBox(...args: any[]): BoundBox {
        return {
            x: -5000,
            y: -5000,
            width: 100000,
            height: 100000,
        }
    }
}
export class EventManager {
    #hoverdElements: Set<CanvasEventTarget> = new Set();
    #lastEvent: MouseEvent | null = null;
    #events: string[] = [];
    #subscribers: { [k: string]: CanvasEventTarget[] } = {};
    #searchTree: Quadtree<CanvasEventTarget>;
    #canvas: HTMLCanvasElement;
    scale = 0;
    constructor(canvas: HTMLCanvasElement) {
        this.#canvas = canvas;

        this.#searchTree = new Quadtree({
            x: 0,
            y: 0,
            width: this.#canvas.width,
            height: this.#canvas.height,
        });

        // 객체 관리 효율성을 위한 좌표 추적용 구독
        let a = canvasEventTargetFactory({
            hasInside(x, y) {
                return true;
            }
        });

        this.subscribe(a);
        a.addEventListener('pointermove', () => { });
    }
    subscribe(target: CanvasEventTarget): void {
        const origin = target.addEventListener.bind(target);
        target.addEventListener = (type, callback, options) => {
            if (!this.#events.includes(type)) {
                this.#events.push(type);
                this.#canvas.addEventListener(type, (event) => {
                    this.dispatch(new (event.constructor as any)(event.type, event));
                });
            }
            if (!this.#subscribers[type]) {
                this.#subscribers[type] = [];
            }
            if (!this.#searchTree.query(target.getBoundBox()).includes(target)) {
                this.#searchTree.insert(target, true);
            }
            this.#subscribers[type].push(target);
            origin(type, callback, options);
        }
    }
    unsubscribe(
        target: CanvasEventTarget
    ): void {
        const keys = this.#events;
        for (const event of keys) {
            const index = this.#subscribers[event].indexOf(target);
            this.#subscribers[event].splice(index, 1);

        }
        this.#searchTree.remove(target);
    }
    /**
     * 이벤트 적용
     * @param event Event를 관리 객체들에 전파합니다.
     * @throws MouseEvent의 경우 hasInside 여부에 따라 전파됩니다. 이를 무시하기 위해서는 수신 객체에 직접 dispatch해야 합니다.
     */
    dispatch(event: Event) {
        if (event instanceof MouseEvent) {
            const cx = (this.#lastEvent?.clientX || 0) * this.scale;
            const cy = (this.#lastEvent?.clientY || 0) * this.scale;

            this.#lastEvent = event;
            const targets = this.#searchTree.query({ x: cx, y: cy, width: 1, height: 1 });
            targets.forEach(x => {
                if (x.hasInside(cx, cy)) {
                    x.dispatchEvent(event);
                }
            })
        } else {
            this.#searchTree.allItems().forEach(x => {
                x.dispatchEvent(event);
            })
        }
    }
    /**
     * mouse leave 및 mouse out등의 실시간 정보 갱신이 필요할 경우 실시간 호출 필요
     */
    update() {
        this.#searchTree.update();
        let temp: Set<CanvasEventTarget> = new Set();
        const lx = (this.#lastEvent?.x || 0) * this.scale;
        const ly = (this.#lastEvent?.y || 0) * this.scale;
        if (this.#lastEvent) {
            const targets = this.#searchTree.query({ x: lx, y: ly, width: 1, height: 1 });

            this.#hoverdElements.forEach(x => {
                this.#updateobjs(x);
                if (x.__hover) {
                    temp.add(x);
                }
            });
            targets?.forEach(x => {
                this.#updateobjs(x);
                if (x.__hover) {
                    temp.add(x);
                }
            });
        }
        this.#hoverdElements = temp;
    }
    /**
     * 디버깅용 제거 예정
     * @param ctx 
     */
    render(ctx: CanvasRenderingContext2D) {
        this.#searchTree.update();
        this.#searchTree.render(ctx, '#0f0');

        const lx = (this.#lastEvent?.x || 0) * this.scale;
        const ly = (this.#lastEvent?.y || 0) * this.scale;
        ctx.beginPath();
        ctx.arc(lx, ly, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    #updateobjs(x: CanvasEventTarget) {
        const cx = (this.#lastEvent?.clientX || 0) * this.scale;
        const cy = (this.#lastEvent?.clientY || 0) * this.scale;
        if (x.__hover && !x.hasInside(cx || NaN, cy || NaN)) {
            let leave = new MouseEvent('mouseleave', this.#lastEvent || undefined);
            let out = new MouseEvent('mouseout', this.#lastEvent || undefined);
            x.dispatchEvent(leave);
            x.dispatchEvent(out);

            let pleave = new PointerEvent('pointerleave', this.#lastEvent || undefined);
            let pout = new PointerEvent('pointerout', this.#lastEvent || undefined);
            x.dispatchEvent(pleave);
            x.dispatchEvent(pout);
            x.__hover = false;
        } else if (!x.__hover && x.hasInside(cx || NaN, cy || NaN)) {
            let enter = new PointerEvent('mouseenter', this.#lastEvent || undefined);
            let over = new PointerEvent('mouseover', this.#lastEvent || undefined);
            x.dispatchEvent(enter);
            x.dispatchEvent(over);

            let penter = new PointerEvent('pointerenter', this.#lastEvent || undefined);
            let pover = new PointerEvent('pointerover', this.#lastEvent || undefined);
            x.dispatchEvent(penter);
            x.dispatchEvent(pover);
            x.__hover = true;
        }
    }
}

export function eventDecoratorFactory(canvasManager: EventManager) {
    return function <T extends new (...args: any[]) => CanvasEventTarget>(constructor: T) {
        return class extends constructor {
            constructor(...args: any[]) {
                super(...args);
                canvasManager.subscribe(this);
            }
            hasInside = constructor.prototype.hasInside
        }
    }
}