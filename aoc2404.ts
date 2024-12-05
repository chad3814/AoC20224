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
    const grid: string[][] = [];
    for (const line of input) {
        grid.push(line.split(''));
    }
    const maxX = grid[0].length;
    const maxY = grid.length;
    if (part === 1) {
        let count = 0;
        for (let y = 0; y < maxY; y++) {
            for (let x = 0; x < maxX; x++) {
                if (grid[y][x] === 'X') {
                    if (x < (maxX - 3)) {
                        if (
                            grid[y][x+1] === 'M' &&
                            grid[y][x+2] === 'A' &&
                            grid[y][x+3] === 'S'
                        ) count++;
                    }
                    if (x >= 3) {
                        if (
                            grid[y][x-1] === 'M' &&
                            grid[y][x-2] === 'A' &&
                            grid[y][x-3] === 'S'
                        ) count++;
                    }
                    if (y < (maxY - 3)) {
                        if (
                            grid[y+1][x] === 'M' &&
                            grid[y+2][x] === 'A' &&
                            grid[y+3][x] === 'S'
                        ) count++;
                    }
                    if (y >= 3) {
                        if (
                            grid[y-1][x] === 'M' &&
                            grid[y-2][x] === 'A' &&
                            grid[y-3][x] === 'S'
                        ) count++;
                    }
                    if (x < (maxX - 3) && y < (maxY - 3)) {
                        if (
                            grid[y+1][x+1] === 'M' &&
                            grid[y+2][x+2] === 'A' &&
                            grid[y+3][x+3] === 'S'
                        ) count++;
                    }
                    if (x >= 3 && y < (maxY - 3)) {
                        if (
                            grid[y+1][x-1] === 'M' &&
                            grid[y+2][x-2] === 'A' &&
                            grid[y+3][x-3] === 'S'
                        ) count++;
                    }
                    if (x < (maxX - 3) && y >= 3) {
                        if (
                            grid[y-1][x+1] === 'M' &&
                            grid[y-2][x+2] === 'A' &&
                            grid[y-3][x+3] === 'S'
                        ) count++;
                    }
                    if (x >= 3 && y >= 3) {
                        if (
                            grid[y-1][x-1] === 'M' &&
                            grid[y-2][x-2] === 'A' &&
                            grid[y-3][x-3] === 'S'
                        ) count++;
                    }
                }
            }
        }
        return count;
    }
    let count = 0;
    for (let y = 1; y < maxY - 1; y++) {
        for (let x = 1; x < maxX - 1; x++) {
            if (grid[y][x] !== 'A') {
                continue;
            }
            if (
                (
                    grid[y-1][x-1] === 'M' &&
                    grid[y+1][x+1] === 'S'
                ) ||
                (
                    grid[y-1][x-1] === 'S' &&
                    grid[y+1][x+1] === 'M'
                )
            ) {
                if (
                    (
                        grid[y-1][x+1] === 'M' &&
                        grid[y+1][x-1] === 'S'
                    ) ||
                    (
                        grid[y-1][x+1] === 'S' &&
                        grid[y+1][x-1] === 'M'
                    )
                ) {
                    count++;
                }
            }
        }
    }

    return count;
}

run(__filename, solve);
