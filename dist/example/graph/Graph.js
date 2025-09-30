var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Grape_data, _Grape_renderData;
import { Unit } from "../../unit/unit.number.js";
export class Grape {
    constructor(width, height, data) {
        _Grape_data.set(this, {});
        _Grape_renderData.set(this, {});
        this.dots = [];
        this.width = width;
        this.height = height;
        __classPrivateFieldSet(this, _Grape_data, data || __classPrivateFieldGet(this, _Grape_data, "f"), "f");
        this.fontSize = Math.min(Math.floor(width / 100), 25);
        this.renderData = __classPrivateFieldGet(this, _Grape_data, "f");
    }
    set data(data) {
        __classPrivateFieldSet(this, _Grape_data, data, "f");
        this.renderData = __classPrivateFieldGet(this, _Grape_data, "f");
    }
    get data() {
        return __classPrivateFieldGet(this, _Grape_data, "f");
    }
    set renderData(data) {
        Object.keys(data).forEach(key => {
            __classPrivateFieldGet(this, _Grape_renderData, "f")[key] = data[key];
        });
    }
    get renderData() {
        return __classPrivateFieldGet(this, _Grape_renderData, "f");
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.fontSize = Math.min(Math.floor(width / 100), 25);
    }
    render(canvas) {
        const cols = new Set();
        let max = -Infinity;
        Object.keys(this.renderData).forEach(x => {
            cols.add(x);
            if (__classPrivateFieldGet(this, _Grape_data, "f")[x] > max) {
                max = __classPrivateFieldGet(this, _Grape_data, "f")[x];
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
            ctx.lineTo(paddingL, vh `100`.crisp);
            ctx.stroke();
        });
        canvas.draw((ctx, { vw }) => {
            ctx.lineWidth = canvas.scale * 2;
            ctx.strokeStyle = 'oklab(0% 0% 0% / 60%)';
            ctx.moveTo(0, rh `${paddingB}`.crisp);
            ctx.lineTo(vw `100`.crisp, rh `${paddingB}`.crisp);
            ctx.stroke();
        });
        // 컬럼명 출력
        canvas.draw((ctx, { rh }) => {
            let i = 0;
            colsArray.forEach((x) => {
                i++;
                ctx.fillText(x, Unit.wrap((paddingL) + (marginW * i)).crisp, rh `${paddingB / 2}`.crisp);
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
                    print = '0';
                    return;
                }
                ctx.fillText(print, paddingL / 2, rh `${i * d}`.crisp - paddingB);
            }
        });
        // 가늠자 라인 출력
        for (let i = 1; i < L; i++) {
            canvas.draw((ctx, { vw }) => {
                ctx.lineWidth = Math.floor(canvas.scale * 1.5);
                ctx.strokeStyle = 'oklab(50% 0% 0% / 10%)';
                ctx.moveTo(paddingL, rh `${i * d}`.crisp - paddingB);
                ctx.lineTo(vw `100`.crisp, rh `${i * d}`.crisp - paddingB);
                ctx.stroke();
            });
        }
        // 컬럼 라인 출력
        for (let i = 0; i < colsArray.length; i++) {
            const x = Unit.wrap((paddingL) + (marginW * (i + 1))).crisp;
            canvas.draw((ctx) => {
                ctx.lineWidth = Math.floor(canvas.scale * 1.5);
                ctx.strokeStyle = 'oklab(50% 0% 0% / 10%)';
                ctx.moveTo(x, 0);
                ctx.lineTo(x, rh `${paddingT}`.crisp);
                ctx.stroke();
            });
        }
        // 값 라인 그래프 출력
        for (let i = 1; i < colsArray.length; i++) {
            const px = Unit.wrap((paddingL) + (marginW * i)).crisp;
            const py = Unit.wrap(i > 0 ? +rh `${this.renderData[colsArray[i - 1]] * marginH}` : this.height - paddingT).crisp - (paddingB);
            const x = Unit.wrap((paddingL) + (marginW * (i + 1))).crisp;
            const y = rh `${(this.renderData[colsArray[i]]) * marginH}`.crisp - (paddingB);
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
            const y = rh `${(this.renderData[colsArray[i]]) * marginH}`.crisp - (paddingB);
            let dot = this.dots[i];
            dot.x = x;
            dot.y = y;
            dot.value = (this.renderData[colsArray[i]]).toFixed(0);
            dot.size = 30;
            dot.render(canvas);
        }
    }
}
_Grape_data = new WeakMap(), _Grape_renderData = new WeakMap();
