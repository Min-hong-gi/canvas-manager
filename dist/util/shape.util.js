export function deg(strings, ...values) {
    let val;
    val = values[0];
    if (strings.length == 1) {
        val = new Number(strings[0]).valueOf();
    }
    return Math.PI / 180 * val;
}
