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
    const width = grid[0].length;
    const height = grid.length;
    let guardX = -1;
    let guardY = -1;
    for (let y = 0; y < height && guardY === -1; y++) {
        for (let x = 0; x < width; x++) {
            if (['^','>','<','v'].includes(grid[y][x])) {
                guardX = x;
                guardY = y;
                break;
            }
        }
    }
    if (guardX === -1 || guardY === -1) {
        throw new Error('NoGuard');
    }
    let guard = grid[guardY][guardX];
    const originalDirection = guard;
    const originalX = guardX;
    const originalY = guardY;

    while (guardX > 0 && guardX < width && guardY > 0 && guardY < height) {
        grid[guardY][guardX] = 'X';
        switch (guard) {
            case '^':
                if (guardY !== 0) {
                    if (grid[guardY - 1][guardX] === '#') {
                        guard = '>';
                        break;
                    }
                }
                guardY--;
                break;
            case 'v':
                if (guardY !== height - 1) {
                    if (grid[guardY + 1][guardX] === '#') {
                        guard = '<';
                        break;
                    }
                }
                guardY++;
                break;
            case '>':
                if (guardX !== width - 1) {
                    if (grid[guardY][guardX + 1] === '#') {
                        guard = 'v';
                        break;
                    }
                }
                guardX++;
                break;
            case '<':
                if (guardX !== 0) {
                    if (grid[guardY][guardX - 1] === '#') {
                        guard = '^';
                        break;
                    }
                }
                guardX--;
                break;
            default:
                throw new Error('invalid guard');
        }
    }
    if (part === 1) {
        let count = 0;
        for (const line of grid) {
            for (const cell of line) {
                if (cell === 'X') {
                    count++;
                }
            }
        }
        return count;
    }

    if (test) {
        for(const line of grid) {
            console.log(line.join(''));
        }
    }
    let count = 0;
    for (let oY = 0; oY < height; oY++) {
        for (let oX = 0; oX < width; oX++) {
            if (oY === originalY && oX === originalX) {
                continue;
            }
            if (grid[oY][oX] !== 'X') {
                continue;
            }
            const positions: string[] = [];
            guardX = originalX;
            guardY = originalY;
            guard = originalDirection;
            grid[oY][oX] = '#';
            while (
                guardX > 0 &&
                guardX < width &&
                guardY > 0 &&
                guardY < height
            ) {
                const position = `${guard}-${guardX}-${guardY}`;
                if (positions.includes(position)) {
                    count++;
                    break;
                }
                positions.push(position);
                switch (guard) {
                    case '^':
                        if (guardY !== 0) {
                            if (grid[guardY - 1][guardX] === '#') {
                                guard = '>';
                                break;
                            }
                        }
                        guardY--;
                        break;
                    case 'v':
                        if (guardY !== height - 1) {
                            if (grid[guardY + 1][guardX] === '#') {
                                guard = '<';
                                break;
                            }
                        }
                        guardY++;
                        break;
                    case '>':
                        if (guardX !== width - 1) {
                            if (grid[guardY][guardX + 1] === '#') {
                                guard = 'v';
                                break;
                            }
                        }
                        guardX++;
                        break;
                    case '<':
                        if (guardX !== 0) {
                            if (grid[guardY][guardX - 1] === '#') {
                                guard = '^';
                                break;
                            }
                        }
                        guardX--;
                        break;
                    default:
                        throw new Error('invalid guard');
                }
            }
            grid[oY][oX] = '.';
        }
    }
    return count;
}

run(__filename, solve);
