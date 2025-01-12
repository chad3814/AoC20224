import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type KeyLockNum = 0|1|2|3|4|5|6;
type KeyLock = [KeyLockNum,KeyLockNum,KeyLockNum,KeyLockNum,KeyLockNum];

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const keys: KeyLock[] = [];
    const locks: KeyLock[] = [];
    for (let i = 0; i < input.length; i++) {
        const isKey = input[i][0] === '.';
        const grid: string[][] = new Array<string[]>(5);
        grid.forEach((_, i) => grid[i] = new Array<string>(7).fill('*'));
        for (let j = 0; j < 7; j++, i++) {
            console.log('line:', input[i]);
            for (let k = 4; k >= 0; k--) {
                grid[k][j] = input[i][j];
                console.log('k:', k, 'j:', j, 'i:', i, 'grid:', grid[k][j], 'input:', input[i][j]);
            }
        }
        console.log('grid:', grid);
        if (isKey) {
            keys.push(grid.reduce(
                (total: KeyLock, tooth: string[]) => {
                    let i = 0;
                    while (i < 5 && tooth[i] === '.') i++;
                    total.push(5-i as KeyLockNum);
                    return total;
                }, [] as unknown as KeyLock)
            );
        } else {
            locks.push(grid.reduce(
                (total: KeyLock, tooth: string[]) => {
                    let i = 0;
                    while (i < 5 && tooth[i] === '#') i++;
                    total.push(5-i as KeyLockNum);
                    return total;
                }, [] as unknown as KeyLock)
            );
        }
    }
    if (part === 1) {
        console.log('keys:', keys);
        console.log('locks:', locks);
        throw new NotImplemented('Not Implemented');
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
