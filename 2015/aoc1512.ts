import { NotImplemented, Options, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Json = string | number | {
    [key: string]: Json
} | Json[];

function* numbers(obj: Json, skipRed = false): Generator<number> {
    if (typeof obj === 'number') {
        yield obj;
        return;
    }
    if (Array.isArray(obj)) {
        for (const o of obj as Json[]) {
            yield * numbers(o, skipRed);
        }
        return;
    }
    if (typeof obj === 'string') return;
    if (skipRed) {
        if ([...Object.values(obj)].some(
            o => o === 'red'
        )) return;
    }
    for (const o of Object.values(obj)) {
        yield * numbers(o, skipRed);
    }
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const json = JSON.parse(input.join(''));
    let total = 0;
    for (const num of numbers(json, part === 2)) {
        total += num;
    }
    return total;
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
