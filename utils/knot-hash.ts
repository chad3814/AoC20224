import { take } from "./take";

export function twist(loop: number[], lengths: number[], p = 0, skip = 0) {
    const size = loop.length;
    for (const length of lengths) {
        const sub = loop.concat(loop).slice(p, p + length).reverse();
        for (let i = 0; i < length; i++, p = (p + 1) % size) {
            loop[p] = sub[i];
        }
        p = (p + skip) % size;
        skip++;
    }
    return {p, skip};
}

export function calculateKnotHash(lengths: number[], loopSize = 256): string {
    const loop: number[] = [];
    for (let i = 0; i < loopSize; i++) {
        loop[i] = i;
    }

    let p = 0;
    let skip = 0;
    for (let i = 0; i < 64; i++) {
        ({p, skip} = twist(loop, lengths, p, skip));
    }
    const dense: number[] = [];
    for (const sparse of take(16, loop)) {
        dense.push(
            sparse.reduce(
                (acc, x) => x ^ acc
            )
        );
    }
    return dense.reduce(
        (s, n) => s + n.toString(16).padStart(2, '0'), ''
    );
}