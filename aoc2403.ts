import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /(mul\(\s*(?<first>\d\d?\d?)\s*,\s*(?<second>\d\d?\d?)\s*\))|(?<do>do\(\))|(?<dont>don't\(\))/gu;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let total = 0;
    if (part === 1) {
        for (const line of input) {
            const matches = line.matchAll(RE);
            for (const match of matches) {
                if (match.groups?.first && match.groups?.second) {
                    const x = parseInt(match.groups.first, 10);
                    const y = parseInt(match.groups.second, 10);
                    total += x * y;
                }
            }
        }
        return total;
    }
    total = 0;
    let enabled = true;
    for (const line of input) {
        const matches = line.matchAll(RE);
        for (const match of matches) {
            if (match.groups?.first && match.groups?.second) {
                const x = parseInt(match.groups.first, 10);
                const y = parseInt(match.groups.second, 10);
                if (enabled)
                    total += x * y;
            }
            if (match.groups?.do) {
                enabled = true;
            }
            if (match.groups?.dont) {
                enabled = false;
            }
        }
    }
    return total;
}

run(__filename, solve, {
    testsOnly: false,
}, {
    reason: "wrong",
    part1length: 1,
    inputs: {
        selector: 'code',
        indexes: [15, 28]
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [17, 34]
    }
});
