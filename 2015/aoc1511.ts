import { NotImplemented, Options, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};

const nextDigit = (memoize<void, [string], string>(1)((d: string): string => {
    if (d === 'z') return 'a';
    if (d === 'i') return 'j';
    if (d === 'l') return 'm';
    if (d === 'o') return 'p';
    return String.fromCharCode(d.charCodeAt(0) + 1);
}));

function increment(str: string): string {
    if (str === '') {
        return 'a';
    }
    const arr = str.split('');
    const last = arr.pop()!;
    const next = nextDigit(last);
    if (next === 'a') {
        return increment(arr.join('')) + 'a';
    }
    arr.push(next);
    return arr.join('');
}

function checkAscending(str: string): boolean {
    const values = str.split('').map(c => c.charCodeAt(0));
    for (let i = 2; i < values.length; i++) {
        const a = values[i - 2] + 2;
        const b = values[i - 1] + 1;
        if (a === b && b === values[i]) return true;
    }
    return false;
}

function checkDoubleDoubles(str: string): boolean {
    let doubleCount = 0;
    for (let i = 1; i < str.length; i++) {
        if (str[i - 1] === str[i]) {
            doubleCount++;
            i++;
        }
    }
    return doubleCount >= 2;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let password = input[0];
    let changed = false;
    password = password.split('').map(
        c => {
            if (changed) return 'a';
            if (c === 'i' || c === 'l' || c === 'o') {
                changed = true;
                return increment(c);
            }
            return c;
        }
    ).join('');

    while (true) {
        password = increment(password);
        if (checkAscending(password) && checkDoubleDoubles(password)) {
            if (part === 1) return password;
            part--;
        }
    }
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
