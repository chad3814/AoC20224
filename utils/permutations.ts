export function* permutations<T>(items: T[]): Generator<T[]> {
    if (items.length === 0) {
        yield [];
        return;
    }
    if (items.length === 1) {
        yield items;
        return;
    }
    for (let i = 0; i < items.length; i++) {
        const otherItems = items.slice();
        otherItems.splice(i, 1);
        for (const permute of permutations(otherItems)) {
            yield [items[i], ...permute];
        }
    }
}