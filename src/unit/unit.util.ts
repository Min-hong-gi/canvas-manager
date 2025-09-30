import { parseTemplate } from "../util/common.utils.js";

/**
 * Degree to radian
 */
export function deg(strings: TemplateStringsArray, ...values: number[]): number {
    let val = parseTemplate(strings, values);
    return Math.PI / 180 * val;
}

/**
 * MilliNumber
 * @param strings 
 * @param values 
 * @returns 
 */
export function mn(strings: TemplateStringsArray, ...values: number[]): number {
    let val = parseTemplate(strings, values);
    return val / 1000;
}
/**
 * Second To MiliSecond
 * @param strings 
 * @param values 
 * @returns 
 */
export function sec(strings: TemplateStringsArray, ...values: number[]): number {
    let val = parseTemplate(strings, values);
    return val * 1000;
}
/**
 * Minit To MiliSecond
 * @param strings 
 * @param values 
 * @returns 
 */
export function minute(strings: TemplateStringsArray, ...values: number[]): number {
    let val = parseTemplate(strings, values);
    return val * 1000 * 60;
}
/**
 * Hour To MiliSecond
 * @param strings 
 * @param values 
 * @returns 
 */
export function hour(strings: TemplateStringsArray, ...values: number[]): number {
    let val = parseTemplate(strings, values);
    return val * 1000 * 60 * 60;
}