import { NotImplemented, run, logger } from "aoc-copilot";

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
        const lines: string[] = [];
        for (let j = 0; j < 7; j++, i++) {
            lines.push(input[i]);
        }
        if (isKey) {
            const key: KeyLock = [0, 0, 0, 0, 0];
            for (let col = 0; col < 5; col++) {
                for (let row = 0; row < 7; row++) {
                    if (lines[row][col] === '#') {
                        key[col] = row as KeyLockNum;
                        break;
                    }
                }
            }
            keys.push(key);
        } else {
            const lock: KeyLock = [0, 0, 0, 0, 0];
            for (let col = 0; col < 5; col++) {
                for (let row = 0; row < 7; row++) {
                    if (lines[row][col] === '.') {
                        lock[col] = row as KeyLockNum;
                        break;
                    }
                }
            }
            locks.push(lock);
        }
    }
    if (part === 1) {
        logger.log('keys:', keys);
        logger.log('locks:', locks);
        let count = 0;
        for (const key of keys) {
            for (const lock of locks) {
                if (lock.every(
                    (tumbler, index) => tumbler <= key[index]
                )) count++;
            }
        }
        return count;
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
