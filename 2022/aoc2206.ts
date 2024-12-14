import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function unique(str: string) {
    const set = new Set(str);
    return set.size === str.length;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const inp = input[0];
    if (part === 1) {
        for (let b = 0, e = 4; e < inp.length; b++, e++) {
            if (unique(inp.substring(b, e))) {
                return e;
            }
        }
    }
    for (let b = 0, e = 14; e < inp.length; b++, e++) {
        if (unique(inp.substring(b, e))) {
            return e;
        }
    }
    throw new Error('No SoM found');
}

run(__filename, solve);
