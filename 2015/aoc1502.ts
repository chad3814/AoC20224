import { NotImplemented, Options, run } from "aoc-copilot";

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
    let bowTotal = 0;
    for await (const line of input) {
        const [width, length, height] = line.split('x').map(s => parseInt(s, 10));
        const sides = [
            width * length,
            width * height,
            length * height,
        ];
        const perimeters = [
            2 * width + 2 * length,
            2 * width + 2 * height,
            2 * length + 2 * height
        ];
        const bow = width * length * height;
        total += 2 * sides[0] + 2 * sides[1] + 2 * sides[2];

        total += Math.min(...sides);
        bowTotal += Math.min(...perimeters) + bow;
    }
    if (part === 1) {
        return total;
    }
    return bowTotal;
}

const options: Options = {};
const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
