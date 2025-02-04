import { NotImplemented, Options, run } from "aoc-copilot";
import { DefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

const forbidden = ['ab', 'cd', 'pq', 'xy'];
const vowels = ['a', 'e', 'i', 'o', 'u'];

function part1(input: string[]): number {
    let nice = 0;
    for (const line of input) {
        let isNaughty = false;
        for (const f of forbidden) {
            if (line.includes(f)) {
                isNaughty = true;
                break;
            }
        }
        if (isNaughty) {
            continue;
        }
        let vowelCount = 0;
        let hasDouble = false;
        let last = '';
        for (const c of line) {
            if (last === c) {
                hasDouble = true;
            }
            last = c;
            vowelCount += vowels.includes(c) ? 1 : 0;
            if (hasDouble && vowelCount >= 3) {
                break;
            }
        }
        if (hasDouble && vowelCount >= 3) {
            nice++;
        }
    }

    return nice;
}

function part2(input: string[]): number {
    let nice = 0;
    for (const word of input) {
        const doubles = new DefaultMap<string, number>(-1);
        let repeatLetter = false;
        let hasDouble = false;
        for (let i = 0; i < word.length - 2; i++) {
            if (word[i + 2] === word[i]) {
                repeatLetter = true;
                if (hasDouble) {
                    break;
                }
            }
            const pair = `${word[i]}${word[i+1]}`;
            const pos = doubles.get(pair);
            if (pos === -1) {
                doubles.set(pair, i);
            } else if (pos !== i - 1) {
                hasDouble = true;
                if (repeatLetter) {
                    break;
                }
            }
        }
        // do the last two letters for doubles
        const pair = `${word[word.length - 2]}${word[word.length - 1]}`;
        const pos = doubles.get(pair);
        if (pos !== -1 && pos !== word.length - 3) {
            hasDouble = true;
        }
        if (repeatLetter && hasDouble) {
            nice++;
        }
    }
    return nice;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        return part1(input);
    }
    return part2(input);
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
