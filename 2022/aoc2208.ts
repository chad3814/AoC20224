import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function isVisible(trees: number[][], x: number, y: number, deltaX: number, deltaY: number): boolean {
    const height = trees[y][x];
    x += deltaX;
    y += deltaY;
    while(x >= 0 && y >= 0 && y < trees.length && x < trees[y].length) {
        if (trees[y][x] == null) {
            console.log(trees.map(li => li.join('')).join('\n'));
            console.error('bad coordinates', x, y, deltaX, deltaY);
        }
        if (trees[y][x] >= height) {
            return false;
        }
        x += deltaX;
        y += deltaY;
    }
    return true;
}

function scenicScore(trees: number[][], x: number, y: number): number {
    const height = trees[y][x];
    let score = 1;
    let row = y - 1;
    for (; row >= 0; row--) {
        if (trees[row][x] >= height) {
            break;
        }
    }
    if (row < 0) row = 0;
    score *= (y - row);

    row = y + 1;
    for (; row < trees.length; row++) {
        if (trees[row][x] >= height) {
            break;
        }
    }
    if (row >= trees.length) row = trees.length - 1;
    score *= (row - y);

    let col = x - 1;
    for (; col >= 0; col--) {
        if (trees[y][col] >= height) {
            break;
        }
    }
    if (col < 0) col = 0;
    score *= (x - col);

    col = x + 1;
    for (; col < trees[y].length; col++) {
        if (trees[y][col] >= height) {
            break;
        }
    }
    if (col >= trees[y].length) col = trees[y].length - 1;
    score *= (col - x);
    return score;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const trees: number[][] = [];
    for (const line of input) {
        trees.push(line.split('').map(Number));
    }
    if (part === 1) {
        let count = trees.length * 2 + (trees[0].length - 2) * 2;
        for (let y = 1; y < trees.length - 1; y++) {
            for (let x = 1; x < trees[y].length - 1; x++) {
                if (isVisible(trees, x, y, -1, 0)) {
                    count++;
                    continue;
                }
                if (isVisible(trees, x, y, 1, 0)) {
                    count++;
                    continue;
                }
                if (isVisible(trees, x, y, 0, -1)) {
                    count++;
                    continue;
                }
                if (isVisible(trees, x, y, 0, 1)) {
                    count++;
                    continue;
                }
            }
        }
        return count;
    }
    if (test) {
        console.log('first:', scenicScore(trees, 2, 1));
        console.log('second:', scenicScore(trees, 2, 3));
    }
    return Math.max(
        ...trees.map(
            (row, y) => Math.max(
                ...row.map(
                    (_, x) => scenicScore(trees, x, y)
                )
            )
        )
    );
}

run(__filename, solve);
