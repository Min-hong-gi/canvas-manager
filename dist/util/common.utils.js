export function parseTemplate(strings, values) {
    if (strings.length === 1)
        return Number(strings[0]);
    return values[0];
}
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
