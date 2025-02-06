import { NotImplemented, Options, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function transform(digits: string): string {
    let last = '';
    let lastIdx = -1;
    let str = '';
    for (let i = 0; i < digits.length; i++) {
        if (last !== digits[i]) {
            if (last !== '') {
                str += (i - lastIdx) + digits[lastIdx];
            }
            last = digits[i];
            lastIdx = i;
        }
    }
    str += (digits.length - lastIdx) + digits[lastIdx];
    return str;
}

const CONWAY = 1.303577269034;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        let digits = input[0];
        for (let i = 0; i < 40; i++) digits = transform(digits);
        return digits.length;
        // let len = input[0].length;
        // return Math.round(len * CONWAY ** 39);
    }
    let digits = input[0];
    for (let i = 0; i < 50; i++) digits = transform(digits);
    return digits.length;
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
