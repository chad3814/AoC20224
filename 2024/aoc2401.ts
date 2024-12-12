import { run } from "aoc-copilot";
import "dot-env";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let total = 0;
    const listA: number[] = [];
    const listB: number[] = [];
    for (const line of input) {
        const [a, b] = line.split(/\s+/);
        listA.push(parseInt(a));
        listB.push(parseInt(b));
    }
    listA.sort(
        (x, y) => x-y
    );
    listB.sort(
        (x, y) => x - y
    );

    if (part === 1) {
        for (let i = 0; i < listA.length; i++) {
            total +=Math.abs(listA[i] - listB[i]);
        }
    } else {
        for (let i = 0; i < listA.length; i++) {
            const same = listB.filter(
                b => b===listA[i]
            );
            total += listA[i] * same.length;
        }
    }
    return total
}

run(__filename, solve);
