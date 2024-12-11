import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function transform(x: number): number[] {
    if (transform.map.has(x)) {
        return transform.map.get(x)!;
    }
    if (x === 0) {
        return [1];
    }
    const y = x.toString(10);
    if (y.length % 2 === 0) {
        const z = [parseInt(y.substring(0, y.length / 2)), parseInt(y.substring(y.length / 2))];
        transform.map.set(x, z);
        return z;
    }
    transform.map.set(x, [x*2024]);
    return [x * 2024];
}
transform.map = new Map<number,number[]>();


function bothParts(stones: number[], blinks: number): number {
    let map = new Map<number, number>();
    for (const stone of stones) {
        map.set(stone, (map.get(stone) ?? 0) + 1);
    }
    for (let i = 0; i < blinks; i++) {
        const blinkMap = new Map<number, number>();
        for (const [stone, amount] of map.entries()) {
            const newStones = transform(stone);
            for (const newStone of newStones) {
                blinkMap.set(newStone, (blinkMap.get(newStone) ?? 0) + amount);
            }
        }
        map = blinkMap;
    }
    let count = 0;
    for (const amount of map.values()) {
        count += amount;
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

run(__filename, solve);
