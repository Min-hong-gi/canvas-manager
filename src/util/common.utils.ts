export function parseTemplate(strings: TemplateStringsArray, values: number[]): number {
    if (strings.length === 1) return Number(strings[0]);
    return values[0];
}

export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}