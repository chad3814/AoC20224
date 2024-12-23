import { NotImplemented, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";
import { inspect } from "util";

type AdditionalInfo = {
    [key: string]: string;
};

const nextSecret = memoize<void, [number], string>(1)((current: number): string => {
    let big = BigInt(current);
    const r1 = big << 6n;
    big ^=  r1;
    big %= 1n << 24n;
    const r2 = big >> 5n;
    big ^= r2;
    big %= 1n << 24n;
    const r3 = big << 11n;
    big ^= r3;
    big %= 1n << 24n;
    return big.toString();
});

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number | bigint> {
    const seeds: number[] = [];
    for (const line of input) {
        seeds.push(Number(line));
    }

    const secrets: number[][] = [];
    for (const seed of seeds) {
        let last = seed;
        const secs: number[] = [seed];
        for(let i = 0; i < 2000; i++) {
            last = parseInt(nextSecret(last), 10);
            secs.push(last);
        }
        secrets.push(secs);
    }

    if (part === 1) {
        return secrets.reduce(
            (t, a) => t + BigInt(a[a.length - 1]), 0n
        )
    }

    const bids: number[][] = [];
    // this maps four changes in a string like `-1,2,-5,8` to an
    // index in bids for each monkey, -1 if that change doesn't happen
    const changeMap = new Map<string, number[]>();
    for (let monkey = 0; monkey < seeds.length; monkey++) {
        bids.push(secrets[monkey].map(s => s % 10));
        const changes: number[] = [];
        for (let bidNum = 1; bidNum < bids[monkey].length; bidNum++) {
            changes.push(bids[monkey][bidNum] - bids[monkey][bidNum - 1]);
        }
        for (let i = 4; i < changes.length; i++) {
            const key = `${changes[i - 4]},${changes[i - 3]},${changes[i - 2]},${changes[i - 1]}`;
            const existing = changeMap.get(key) ?? [];
            if (existing.length -1 === monkey) {
                // this key has already occured for this monkey, skip
                continue;
            }
            for (let m = existing.length; m < monkey; m++) {
                existing.push(0);
            }
            existing.push(bids[monkey][i]);
            changeMap.set(key, existing);
        }
    }

    let max = 0;
    let maxChange = '';
    for (const [change, bananas] of changeMap.entries()) {
        const totalBananas = bananas.reduce((t, a) => t + a, 0);
        if (totalBananas > max) {
            max = totalBananas;
            maxChange = change;
        }
    }

    return max;
}

type AocCopilotOptions = {
    testsOnly?: boolean;
    skipTests?: boolean;
    onlyPart?: 1|2;
};
const options: AocCopilotOptions = {}

const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
