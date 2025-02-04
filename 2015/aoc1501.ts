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
    let floor = 0;
    let index = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < input[0].length; i++) {
        const c = input[0][i];
        if (c === '(') floor++;
        if (c === ')') floor--;
        if (floor < 0 && i < index) {
            index = i + 1;
        }
    }

    if (part === 1) {
        return floor;
    }
    return index;
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
