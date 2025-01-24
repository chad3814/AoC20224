import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Garbage = {
    str: string;
};

type Group = {
    data: (Group|Garbage)[];
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const stream = input[0].split('');
    let score = 0;
    let level = 0;
    let inGarbage = false;
    let garbageCount = 0;
    for (let i = 0; i < stream.length; i++) {
        const c = stream[i];
        if (!inGarbage && c === '<') {
            inGarbage = true;
            continue;
        }
        if (inGarbage && c === '>') {
            inGarbage = false;
            continue;
        }
        if (c === '!') {
            i++;
            continue;
        }
        if (inGarbage) {
            garbageCount++;
            continue;
        }
        if (c === '{') {
            level++;
            score += level;
        }
        if (c === '}') {
            level--;
        }
    }
    if (part === 1) {
        return score;
    }
    return garbageCount;
}

run(__filename, solve);
