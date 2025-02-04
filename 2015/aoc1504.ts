import { NotImplemented, Options, run } from "aoc-copilot";
import { createHash } from "node:crypto";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let i = 1;
    let done = false;
    while (!done) {
        const hasher = createHash('MD5');
        hasher.update(input[0]);
        hasher.update(i.toString(10));
        const hash = hasher.digest().toString('hex');
        if (
            part === 1 &&
            hash[0] === '0' &&
            hash[1] === '0' &&
            hash[2] === '0' &&
            hash[3] === '0' &&
            hash[4] === '0'
        ) {
            return i;
        }
        if (
            part === 2 &&
            hash[0] === '0' &&
            hash[1] === '0' &&
            hash[2] === '0' &&
            hash[3] === '0' &&
            hash[4] === '0' &&
            hash[5] === '0'
        ) {
            return i;
        }
        i++;
    }
    throw new Error('should not reach');
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
