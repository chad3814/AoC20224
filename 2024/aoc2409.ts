import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        let count = 0;
        for (const diskMap of input) {
            const values = diskMap.split('').map(v => parseInt(v, 10));
            const disk: number[] = [];
            let fileId = 0;
            for (let i = 0; i < values.length; i++) {
                if (i % 2) {
                    for (let j = 0; j < values[i]; j++) {
                        disk.push(-1);
                    }
                } else {
                    for (let j = 0; j < values[i]; j++) {
                        disk.push(fileId);
                    }
                    fileId++;
                }
            }
            for (let i = disk.length - 1; i >= 0; i--) {
                const nextFreeSpace = disk.indexOf(-1);
                if (nextFreeSpace === -1) {
                    throw new Error('no free space');
                }
                if (nextFreeSpace > i) {
                    break;
                }
                disk[nextFreeSpace] = disk[i];
                disk[i] = -1;
            }
            for (let i = 0; i < disk.length; i++) {
                if (disk[i] === -1) {
                    break;
                }
                count += i * disk[i];
            }
            return count;
        }
    }
    let count = 0;
    for (const diskMap of input) {
        const freeList: {space: number; index: number}[] = [];
        const fileList: {size: number; index: number, id: number}[] = [];
        const values = diskMap.split('').map(v => parseInt(v, 10));
        let idx = 0;
        let fileId = 0;
        for (let i = 0; i < values.length; i++) {
            if (i % 2) {
                freeList.push({space: values[i], index: idx});
            } else {
                fileList.push({size: values[i], index: idx, id: fileId});
                fileId++;
            }
            idx += values[i];
        }
        console.log('fileList:', fileList);
        console.log('freeList:', freeList);
        for (let i = fileList.length - 1; i >= 0; i--) {
            const file = fileList[i];
            const freeSpotIndex = freeList.findIndex(
                free => free.space >= file.size && free.index < file.index
            );
            if (freeSpotIndex === -1) {
                continue;
            }
            file.index = freeList[freeSpotIndex].index;
            freeList[freeSpotIndex].index += file.size;
            freeList[freeSpotIndex].space -= file.size;
            if (freeList[freeSpotIndex].space < 1) {
                freeList.splice(freeSpotIndex, 1);
            }
        }
        console.log('fileList:', fileList.sort(
            (a, b) => a.index - b.index
        ));
        console.log('freeList:', freeList);
        const disk = new Array(values.reduce((a, b) => a+b)).fill('.');
        for (const file of fileList) {
            for (let i = 0; i < file.size; i++) {
                count += file.id * (file.index + i);
            }
        }
        console.log('disk:', disk.join(''));
    }
    return count;
}

run(__filename, solve);
