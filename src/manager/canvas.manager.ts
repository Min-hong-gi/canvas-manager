import { Unit } from "../unit/unit.number.js";
import { parseTemplate } from "../util/common.utils.js";

export type DrawOption = Pick<CanvasManager, 'vw' | 'vh' | 'rw' | 'rh'>;

type ContextAttributes = {
    alpha?: boolean,
    antialias?: boolean,
    depth?: boolean,
    failIfMajorPerformanceCaveat?: boolean,
    powerPreference?: 'default' | 'high-performance' | 'low-power',
    premultipliedAlpha?: boolean,
    preserveDrawingBuffer?: boolean,
    stencil?: boolean
};

export class CanvasManager {
    #scale: number;
    #canvas: HTMLCanvasElement;
    #ctx: CanvasRenderingContext2D;
    constructor(canvas: HTMLCanvasElement, options?: ContextAttributes) {
        this.#canvas = canvas;
        this.#scale = 1;
        let ctx = canvas.getContext('2d', options);
        if(!ctx) {
            throw new Error(`Fail get context 2D`);
        }
        this.#ctx = ctx as CanvasRenderingContext2D;
    }
    get canvasWidth() {
        return this.#canvas.width;
    }
    get canvasHeight() {
        return this.#canvas.height;
    }
    set scale(scale: number) {
        this.#ctx.scale(scale, scale);
        this.#scale = scale;
    }
    get scale() {
        return this.#scale;
    }
    draw<T>(drawFn: (ctx: CanvasRenderingContext2D, options: DrawOption) => T, { pathable, saveState }: { pathable?: boolean, saveState?: boolean } = { pathable: true, saveState: true }): T {
        if (saveState) {
            this.#ctx.save();
        }
        if (pathable) {
            this.#ctx.beginPath();
        }
        const temp = drawFn(this.#ctx, this);
        if (pathable) {
            this.#ctx.closePath();
        }
        if (saveState) {
            this.#ctx.restore();
        }
        return temp;
    }
    state<T>(drawFn: (ctx: CanvasRenderingContext2D, options: DrawOption) => T): T {
        return drawFn(this.#ctx, this);
    }
    clear(): void;
    clear(width: number, height: number): void;
    clear(width?: number, height?: number) {
        if (width && height) {
            this.#ctx.clearRect(0, 0, width, height);
        } else {
            this.#ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
    resize(): void;
    resize(width: number, height: number): void;
    resize(width?: number, height?: number): void {
        if (width) {
            this.#canvas.width = width * this.#scale;
        } else {
            this.#canvas.width = this.#canvas.clientWidth * this.#scale;
        }
        if (height) {
            this.#canvas.height = height * this.#scale;
        } else {
            this.#canvas.height = this.#canvas.clientHeight * this.#scale;
        }
    }
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
    vw = (strings: TemplateStringsArray, ...values: number[]): Unit => {
        let val = parseTemplate(strings, values);
        return Unit.wrap(this.canvasWidth / 100 * val);
    }
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
    vh = (strings: TemplateStringsArray, ...values: number[]): Unit => {
        let val = parseTemplate(strings, values);
        return Unit.wrap(this.canvasHeight / 100 * val);
    }
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
    rw = (strings: TemplateStringsArray, ...values: number[]): Unit => {
        let val = parseTemplate(strings, values);
        return Unit.wrap(this.canvasWidth - val);
    }
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
    rh = (strings: TemplateStringsArray, ...values: number[]): Unit => {
        let val = parseTemplate(strings, values);
        return Unit.wrap(this.canvasHeight - val);
    }
    isPointInPath(shape: Path2D, x: number, y: number) {
        return this.#ctx.isPointInPath(shape, x, y);
    }
    isStrokeInPath(shape: Path2D, x: number, y: number) {
        return this.#ctx.isPointInStroke(shape, x, y);
    }
}
