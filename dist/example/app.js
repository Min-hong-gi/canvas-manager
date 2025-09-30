var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { GrapeDot } from "./graph/Graph-dot.js";
import { Grape } from "./graph/Graph.js";
import { CanvasManager } from "../manager/canvas.manager.js";
import { eventDecoratorFactory, EventManager } from "../manager/event.manager.js";
import { lerp } from "../util/common.utils.js";
import { animate, frameLate } from "../util/frame.utils.js";
import { rand } from "../util/math.utils.js";
const canvasEl = document.querySelector('#main-canvas');
const mainCanvas = new CanvasManager(canvasEl);
mainCanvas.scale = 3;
mainCanvas.resize();
const eventManager = new EventManager(canvasEl);
const mainEvent = eventDecoratorFactory(eventManager);
eventManager.scale = 3;
const grapeData = {
    '0': rand(1, 10) * 100,
    '1': rand(1, 10) * 100,
    '2': rand(1, 10) * 100,
    '3': rand(1, 10) * 100,
    '4': rand(1, 10) * 100,
    '5': rand(1, 10) * 100,
    '6': rand(1, 10) * 100,
    '7': rand(1, 10) * 100,
    '8': rand(1, 10) * 100,
    '9': rand(1, 10) * 100,
    '10': rand(1, 10) * 100,
    '11': rand(1, 10) * 100,
    '12': rand(1, 10) * 100,
    '13': rand(1, 10) * 100,
    '14': rand(1, 10) * 100,
    '15': rand(1, 10) * 100,
    '16': rand(1, 10) * 100,
    '17': rand(1, 10) * 100,
    '18': rand(1, 10) * 100,
    '19': rand(1, 10) * 100,
    '20': rand(1, 10) * 100,
    '21': rand(1, 10) * 100,
    '22': rand(1, 10) * 100,
    '23': rand(1, 10) * 100,
    '24': rand(1, 10) * 100,
};
const grape = new Grape(mainCanvas.canvasWidth, mainCanvas.canvasHeight, grapeData);
let EventTarget = class EventTarget extends GrapeDot {
};
EventTarget = __decorate([
    mainEvent
], EventTarget);
grape.dots = Array.from({ length: Object.keys(grape.renderData).length }, () => new EventTarget());
grape.dots.forEach(x => {
    x.addEventListener('click', () => {
        x.fixed = !x.fixed;
    });
    x.addEventListener('mouseenter', () => {
        console.log(x.size);
        animate((t) => {
            x.opacity = lerp(0, 1, t);
        }, 0.1);
        canvasEl.style.cursor = 'pointer';
    });
    x.addEventListener('mouseleave', () => {
        console.log(2);
        animate((t) => {
            x.opacity = lerp(1, 0, t);
        }, 0.1);
        canvasEl.style.cursor = 'auto';
    });
});
window.addEventListener('resize', () => {
    mainCanvas.resize();
    grape.resize(mainCanvas.canvasWidth, mainCanvas.canvasHeight);
    grape.render(mainCanvas);
});
frameLate(60, () => {
    eventManager.update();
    return true;
}, () => {
    mainCanvas.clear();
    grape.render(mainCanvas);
});
animate((t, delta, alpha) => {
    let renderData = {};
    Object.keys(grape.data).forEach(key => {
        renderData[key] = lerp(0, grape.data[key], t);
    });
    grape.renderData = renderData;
}, 1);
