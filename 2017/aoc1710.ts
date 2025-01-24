import { NotImplemented, run } from "aoc-copilot";
import { take } from "../utils/take";

type AdditionalInfo = {
    [key: string]: string;
};

function twist(loop: number[], lengths: number[], p = 0, skip = 0) {
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

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const loop: number[] = [];
    const size = test && part === 1 ? 5 : 256;
    for (let i = 0; i < size; i++) {
        loop[i] = i;
    }
    if (part === 1) {
        const lengths = input[0].split(',').map(Number);
        twist(loop, lengths);
        return loop[0] * loop[1];
    }
    const lengths = input[0].split('').map(c => c.charCodeAt(0));
    lengths.push(17, 31, 73, 47, 23);
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

run(__filename, solve);
