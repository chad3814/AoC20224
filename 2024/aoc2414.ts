import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /^p=(?<x>\d+),(?<y>\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)$/u;
type Robot = {
    x: number;
    y: number;
    vx: number;
    vy: number;
}
export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const counts = [0,0,0,0];
    const width = test ? 11 : 101;
    const height = test ? 7 : 103;
    const column = Math.floor(width / 2);
    const row = Math.floor(height / 2);

    const field: number[][] = [];
    for (let i = 0; i < height; i++) {
        field.push(new Array(width).fill(0));
    }

    function dump() {
        for (let j = 0; j < height; j++) {
             const line = field[j];
            console.log(line.map(
                i => i === 0 ? '.' : i).join('')
            );
        }
    }
    if (part === 1) {
        for (const line of input) {
            if (line === '') continue;
            const matches = line.match(RE);
            if (!matches?.groups) {
                throw new Error('RE');
            }
            const {x: sX, y: sY, vx: sVx, vy: sVy} = matches.groups;
            const x = parseInt(sX, 10);
            const y = parseInt(sY, 10);
            const vx = parseInt(sVx, 10);
            const vy = parseInt(sVy, 10);
            const endX = (x + 100*vx + 100*width)%width;
            const endY = (y + 100*vy + 100*height)%height;
            if (endX < column && endY < row) counts[0]++;
            if (endX < column && endY > row) counts[1]++;
            if (endX > column && endY < row) counts[2]++;
            if (endX > column && endY > row) counts[3]++;
            if (test) field[endY][endX]++;
        }
        return counts[0]*counts[1]*counts[2]*counts[3];
    }
    const robots: Robot[] = [];
    for (const line of input) {
        if (line === '') continue;
        const matches = line.match(RE);
        if (!matches?.groups) {
            throw new Error('RE');
        }
        const {x: sX, y: sY, vx: sVx, vy: sVy} = matches.groups;
        const x = parseInt(sX, 10);
        const y = parseInt(sY, 10);
        const vx = parseInt(sVx, 10);
        const vy = parseInt(sVy, 10);
        robots.push({x, y, vx, vy});
    }
    let i = 0;
    let found = false;
    while (!found) {
        for (const robot of robots) {
            const x = (robot.x + i*robot.vx + i*width) % width;
            const y = (robot.y + i*robot.vy + i*height) % height;
            field[y][x]++;
        }
        let found = true;
        for (const line of field) {
            for (const cell of line) {
                if (cell > 1) {
                    found = false;
                    break;
                }
            }
        }
        if (found) {
           console.log('--', i, '--');
            dump();
            console.log();
            break;
        }
        for (const line of field) {
            line.fill(0);
        }
        i++;
    }
    return i;
}

run(__filename, solve, undefined, {
    reason: 'No part 2 test',
    part1length: 1,
    inputs: {
        selector: 'code',
        indexes: [2]
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [29]
    }
});
