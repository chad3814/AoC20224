import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Backpack = number[];

function sum(backpack: Backpack): number {
    return backpack.reduce((a, b) => a + b, 0);
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const backpacks: Backpack[] = [];
    let current: Backpack = [];
    for (const line of input) {
        if (line === '') {
            backpacks.push(current);
            current = [];
            continue;
        }
        current.push(parseInt(line, 10));
    }
    if (current.length > 0) {
        backpacks.push(current);
    }

    if (part === 1) {
        return Math.max(...backpacks.map(sum));
    }
    backpacks.sort(
        (a, b) => sum(b) - sum(a)
    );
    const top3 = backpacks.slice(0, 3).map(sum);
    return sum(top3);
}

run(__filename, solve);
