import { sec } from "../unit/unit.util.js";

/**
 * 
 * @param frame 업데이트 프레임 - 일반 PC기준 보통 60프레임
 * @param update 업데이트 함수 - 프레임 제한 없이 실행됨.
 * @param render 렌더링 함수 - 프레임 제한에 맞춰 실행됨.
 */
export function frameLate(
    frame: number,
    update: (step: number, delta: number, alpha: number) => boolean,
    render: (step: number, delta: number, alpha: number) => void
) {
    let prev = 0;
    let accumulator = 0;
    let step = 1 / frame;
    const anime = (time: number) => {
        if (!prev) {
            prev = time;
        }

        const delta = (time - prev) / sec`1`;
        prev = time;
        accumulator += delta;

        let alpha = accumulator / step;
        if (frame === 0) {
            alpha = 0;
            step = 0;
        }
        let flag = true;
        while (frame && (accumulator) >= step) {
            flag = flag && update(step, delta, alpha);
            accumulator -= step;
        }

        render(step, delta, alpha);
        if (flag) {
            requestAnimationFrame(anime);
        }
    }
    requestAnimationFrame(anime);
}

/**
 * 
 * @param animation 처리할 애니메이션 함수
 * @param duration 시간 ms
 * @param frame 애니메이션 진행 프레임
 */
export function animate(animation: (t: number, delta: number, alpha: number) => void, duration: number, frame: number = 60, callback = ():void => {}) {
    let prev = 0;
    let accumulator = 0;
    let step = 1 / frame;
    let a = 0;
    const anime = (time: number) => {
        if (!prev) {
            prev = time;
        }
        if (duration <= 0) {
            animation(1, 0, 0);
            return;
        }

        const delta = (time - prev);
        prev = time;
        accumulator += delta;

        let alpha = accumulator / step;
        if (frame === 0) {
            alpha = 0;
            step = 0;
        }

        while (frame && (accumulator) >= step) {
            accumulator -= step;
            a += step;
        }

        let t = Number(Math.min(1, a / duration));

        animation(t, delta, alpha);
        if (t < 1) {
            requestAnimationFrame(anime);
        } else {
            callback();
        }
    }
    requestAnimationFrame(anime);
}