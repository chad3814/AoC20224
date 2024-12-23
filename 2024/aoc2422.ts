import { NotImplemented, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";

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
    // console.log(current, '=>', big);
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

    if (part === 1) {
        return seeds.map(
            seed => {
                let last = seed;
                for(let i = 0; i < 2000; i++)
                    last = parseInt(nextSecret(last), 10);
                // console.log(seed, '=>', last);
                return last;
            }
        ).reduce(
            (t, a) => t + BigInt(a), 0n
        );
    }
    throw new NotImplemented('Not Implemented');
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
