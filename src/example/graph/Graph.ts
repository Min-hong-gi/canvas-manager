import { CanvasManager } from "../../manager/canvas.manager.js";
import { Unit } from "../../unit/unit.number.js";
import { GrapeDot } from "./Graph-dot.js";

export class Grape {
    fontSize: number;
    width: number;
    height: number;
    #data: GrapeData = {};
    #renderData: GrapeData = {};
    dots: GrapeDot[] = [];
    constructor(width: number, height: number, data: GrapeData) {
        this.width = width;
        this.height = height;
        this.#data = data || this.#data;
        this.fontSize = Math.min(Math.floor(width / 100), 25);
        this.renderData = this.#data;
    }
    set data(data: GrapeData) {
        this.#data = data;
        this.renderData = this.#data;
    }
    get data() {
        return this.#data;
    }

    set renderData(data: GrapeData) {
        Object.keys(data).forEach(key => {
            this.#renderData[key] = data[key];
        });
    }

    get renderData() {
        return this.#renderData;
    }
    resize(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.fontSize = Math.min(Math.floor(width / 100), 25);
    }
    render(canvas: CanvasManager) {
        const cols: Set<string> = new Set();
        let max = -Infinity;
        Object.keys(this.renderData).forEach(x => {
            cols.add(x);
            if (this.#data[x] > max) {
                max = this.#data[x];
            }
        });

        let fontSize = this.fontSize * canvas.scale;


        // 그래프 밖 글자 영역
        let paddingL = fontSize * 4;
        let paddingR = 0;
        let paddingT = fontSize * 4;
        let paddingB = fontSize * 4;

        // 그래프 속성 글자 출력 간격
        let marginW = (this.width - (paddingL + paddingR)) / (cols.size + 1);
        // 그래프 값 1당 움직이는 거리
        let marginH = (this.height - (paddingT + paddingB)) / max;
        if (max === 0) {
            marginH = 0;
        }
        // 값 가늠선 최소 거리
        let gap = fontSize * 3;

        const colsArray = Array.from(cols);

        const rh = canvas.rh;

        // 캔버스 전역 설정
        canvas.state((ctx) => {
            ctx.font = `100 ${fontSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
        });

        canvas.draw((ctx, { vh }) => {
            ctx.lineWidth = canvas.scale * 2;
            ctx.strokeStyle = 'oklab(0% 0% 0% / 60%)';

            ctx.moveTo(paddingL, 0);
            ctx.lineTo(paddingL, vh`100`.crisp);
            ctx.stroke();
        });

        canvas.draw((ctx, { vw }) => {
            ctx.lineWidth = canvas.scale * 2;
            ctx.strokeStyle = 'oklab(0% 0% 0% / 60%)';

            ctx.moveTo(0, rh`${paddingB}`.crisp);
            ctx.lineTo(vw`100`.crisp, rh`${paddingB}`.crisp);
            ctx.stroke();
        });

        // 컬럼명 출력
        canvas.draw((ctx, { rh }) => {
            let i = 0;
            colsArray.forEach((x) => {
                i++;
                ctx.fillText(x, Unit.wrap((paddingL) + (marginW * i)).crisp, rh`${paddingB / 2}`.crisp);
            });
        });

        // 적절한 가늠자 개수 및 가늠자 별 간격 계산
        const n = paddingB;
        const m = this.height - (paddingT + paddingB);
        const L = Math.floor((m - n) / gap) + 1;
        const d = m / (L - 1);

        // 가늠자 문자 출력
        canvas.draw((ctx) => {
            for (let i = 1; i < L; i++) {
                let print = `${((i * d) / marginH).toFixed(0)}`;
                if (marginH === 0) {
                    print = '0'
                    return;
                }
                ctx.fillText(print, paddingL / 2, rh`${i * d}`.crisp - paddingB);
            }
        });

        // 가늠자 라인 출력
        for (let i = 1; i < L; i++) {
            canvas.draw((ctx, { vw }) => {
                ctx.lineWidth = Math.floor(canvas.scale * 1.5);

                ctx.strokeStyle = 'oklab(50% 0% 0% / 10%)';

                ctx.moveTo(paddingL, rh`${i * d}`.crisp - paddingB);
                ctx.lineTo(vw`100`.crisp, rh`${i * d}`.crisp - paddingB);
                ctx.stroke();
            })
        }

        // 컬럼 라인 출력
        for (let i = 0; i < colsArray.length; i++) {

            const x = Unit.wrap((paddingL) + (marginW * (i + 1))).crisp;

            canvas.draw((ctx) => {
                ctx.lineWidth = Math.floor(canvas.scale * 1.5);

                ctx.strokeStyle = 'oklab(50% 0% 0% / 10%)';

                ctx.moveTo(x, 0);
                ctx.lineTo(x, rh`${paddingT}`.crisp);
                ctx.stroke();
            })

        }

        // 값 라인 그래프 출력
        for (let i = 1; i < colsArray.length; i++) {
            const px = Unit.wrap((paddingL) + (marginW * i)).crisp;
            const py = Unit.wrap(i > 0 ? +rh`${this.renderData[colsArray[i - 1]] * marginH}` : this.height - paddingT).crisp - (paddingB);
            const x = Unit.wrap((paddingL) + (marginW * (i + 1))).crisp;
            const y = rh`${(this.renderData[colsArray[i]]) * marginH}`.crisp - (paddingB);

            canvas.draw((ctx) => {
                ctx.lineWidth = 5;

                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.stroke();
            });
        }

        // 값 포인트 출력
        for (let i = colsArray.length - 1; i >= 0; i--) {
            const x = Unit.wrap((paddingL) + (marginW * (i + 1))).crisp;
            const y = rh`${(this.renderData[colsArray[i]]) * marginH}`.crisp - (paddingB);

            let dot = this.dots[i];
            dot.x = x;
            dot.y = y;
            dot.value = (this.renderData[colsArray[i]]).toFixed(0);
            dot.size = 30;

            dot.render(canvas);
        }
    }
}

export type GrapeData = {
    [k: string]: number
}