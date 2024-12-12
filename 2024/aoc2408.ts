import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Point = [number, number];

type Node = {
    type: string;
    point: Point;
};

function getDistance(a: Point, b: Point): number {
    return Math.sqrt(
        (a[0] - b[0])**2 +
        (a[1] - b[1])**2
    );
}

function getSlope(a: Point, b: Point): number {
    return (a[1] - b[1]) / (a[0] - b[0]);
}

const re = /[A-Za-z0-9]/u;

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
    const nodes = new Map<string, Point[]>();
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x].match(re)) {
                const points = nodes.get(grid[y][x]) ?? [];
                points.push([x, y]);
                nodes.set(
                    grid[y][x],
                    points
                );
            }
        }
    }
    let count = 0;
    const antinodeSet = new Set<string>();
    if (part === 1) {
        for (const [type, points] of nodes.entries()) {
            for (let i = 0; i < points.length; i++) {
                const a = points[i];
                const rest = points.slice(i + 1);
                for (const b of rest) {
                    const deltaX = a[0] - b[0];
                    const deltaY = a[1] - b[1];
                    const antinodes: Point[] = [
                        [a[0] + deltaX, a[1] + deltaY],
                        [b[0] + deltaX, b[1] + deltaY],
                        [a[0] - deltaX, a[1] - deltaY],
                        [b[0] - deltaX, b[1] - deltaY],
                    ];
                    for (const antinode of antinodes) {
                        if (
                            antinode[0] >= 0 &&
                            antinode[0] < grid[0].length &&
                            antinode[1] >= 0 &&
                            antinode[1] < grid.length &&
                            grid[antinode[1]][antinode[0]] !== type &&
                            !antinodeSet.has(`${antinode[0]},${antinode[1]}`)
                        )
                        {
                            count++;
                            antinodeSet.add(`${antinode[0]},${antinode[1]}`);
                            if (test) console.log('a:', a, 'b:', b, 'antinode:', antinode, 'grid:', grid[antinode[1]][antinode[0]], 'type:', type);
                        }
                    }
                }
            }
        }
        return count;
    }
    for (const [type, points] of nodes.entries()) {
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            const rest = points.slice(i + 1);
            for (const b of rest) {
                const deltaX = a[0] - b[0];
                const deltaY = a[1] - b[1];
                let x = a[0] - deltaX;
                let y = a[1] - deltaY;
                while (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
                    antinodeSet.add(`${x},${y}`);
                    x -= deltaX;
                    y -= deltaY;
                }
                x += deltaX;
                y += deltaY;
                while (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
                    antinodeSet.add(`${x},${y}`);
                    x += deltaX;
                    y += deltaY;
                }
            }
        }
    }

    return antinodeSet.size;
}

run(__filename, solve);
