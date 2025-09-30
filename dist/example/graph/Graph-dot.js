import { CanvasEventTarget } from "../../manager/event.manager.js";
import { len, subtract } from "../../util/vector.utils.js";
export class GrapeDot extends CanvasEventTarget {
    constructor() {
        super(...arguments);
        this.x = -1;
        this.y = -1;
        this.size = 0;
        this.value = null;
        this.opacity = 0;
        this.fixed = false;
    }
    hasInside(x, y) {
        return len(subtract({ x, y }, { x: this.x, y: this.y })) <= this.size;
    }
    getBoundBox() {
        return {
            x: this.x - this.size,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2,
        };
    }
    render(canvas) {
        canvas.draw((ctx) => {
            ctx.fillStyle = '#3af';
            if (this.fixed || this.__hover) {
                ctx.fillStyle = '#f56';
            }
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        });
        if (this.fixed) {
            this.opacity = 1;
        }
        canvas.draw((ctx) => {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            const matrics = ctx.measureText(this.value);
            const height = matrics.actualBoundingBoxDescent * 1.2;
            ctx.fillRect(this.x + this.size * 2, this.y - height / 2, matrics.width, height);
        });
        canvas.draw((ctx) => {
            ctx.fillStyle = `rgba(3, 3, 3, ${this.opacity})`;
            ctx.textAlign = 'left';
            ctx.fillText(this.value, this.x + this.size * 2, this.y);
        });
    }
}
