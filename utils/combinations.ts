export function combos<T>(arr: T[]): T[][] {
    const c: T[][] = [];
    if (arr.length === 0) {
        return [];
    }
    if (arr.length === 1) {
        return [[arr[0]]];
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        c.push([item]);
        const others = arr.slice();
        others.splice(i, 1);
        for (const combo of combos(others)) {
            c.push([item, ...combo]);
        }
    }
    return c;
}

export function* comboG<T>(arr: T[]): Generator<T[]> {
    if (arr.length === 0) {
        return [];
    }
    if (arr.length === 1) {
        return [arr[0]];
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        yield [item];
        const others = arr.slice();
        others.splice(i, 1);
        for (const combo of comboG(others)) {
            yield [item, ...combo];
        }
    }
}