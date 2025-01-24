import { logger, NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function maxIndex(blocks: number[]): number {
    const max = Math.max(...blocks);
    return blocks.indexOf(max);
}

function key(blocks: number[]): string {
    return blocks.join('-');
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const blocks = input[0].split(/\s+/).map(Number);
    if (part === 1) {
        let count = 0;
        const set = new Set<string>();
        while (!set.has(key(blocks))) {
            logger.log('blocks:', blocks, key(blocks));
            set.add(key(blocks));
            count++;
            let idx = maxIndex(blocks);
            const blockCount = blocks[idx];
            blocks[idx] = 0;
            idx = (idx + 1) % blocks.length;
            for (let i = 0; i < blockCount; i++, idx = (idx + 1) % blocks.length) {
                blocks[idx]++;
            }
        }
        return count;
    }
    let iteration = 0;
    const map = new Map<string, number>();
    while (!map.has(key(blocks))) {
        logger.log('blocks:', blocks, key(blocks));
        map.set(key(blocks), iteration);
        iteration++;
        let idx = maxIndex(blocks);
        const blockCount = blocks[idx];
        blocks[idx] = 0;
        idx = (idx + 1) % blocks.length;
        for (let i = 0; i < blockCount; i++, idx = (idx + 1) % blocks.length) {
            blocks[idx]++;
        }
    }
    return iteration - map.get(key(blocks))!;
}

run(__filename, solve);
