import { NotImplemented, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};

const _transform = (x: number): [number] | [number, number] => {
    if (x === 0) {
        return [1];
    }

    const digits = Math.floor(Math.log10(x)) + 1;
    if (digits % 2 === 0) {
        const midpoint = digits / 2;
        const tens = 10**midpoint;
        return [Math.floor(x / tens), x % tens];
    }

    return [x * 2024];
}

const transform = memoize<void, Parameters<typeof _transform>, ReturnType<typeof _transform>>(1)(_transform);

const _transformBlinks = (stone: number, blinks: number): number => {
    if (blinks === 0) {
        return 0;
    }
    const stones = transform(stone);
    if (blinks === 1) {
        return stones.length;
    }
    const counts = stones.map(s => transformBlinks(s, blinks - 1));
    return counts.reduce((a, b) => a + b, 0);
};

const transformBlinks = memoize<void, Parameters<typeof _transformBlinks>, ReturnType<typeof _transformBlinks>>(2)(_transformBlinks);


function bothParts(stones: number[], blinks: number): number {
    let count = 0;
    for (const stone of stones) {
        count += transformBlinks(stone, blinks);
    }
    return count;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let stones = input[0].split(/\s+/gu).map(i => parseInt(i, 10));
    if (part === 1) {
        return bothParts(stones, 25);
    }
    return bothParts(stones, 75);
}

run(__filename, solve, {skipTests: true});
