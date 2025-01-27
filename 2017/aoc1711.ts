import { logger, NotImplemented, run } from "aoc-copilot";
import { emptyHexGraph, HexPoint } from "../utils/hex-graph";
import { Path, PointLike } from "../utils/point";
import { DefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

function dijkstra(p1: PointLike, p2: PointLike, allPoints: Iterable<PointLike>): Path|null {
    const distances = new DefaultMap<PointLike, number>(Number.POSITIVE_INFINITY);
    const unvisited = new Set<PointLike>(allPoints);
    const previous = new Map<PointLike, PointLike[]>();
    distances.set(p1, 0);
    while (true) {
        const node = [...unvisited.keys()].sort(
            (a, b) => distances.get(a) - distances.get(b)
        )[0];
        const distance = distances.get(node);

        if (distance === Number.POSITIVE_INFINITY) {
            // no path from p1 to p2
            return null;
        }

        if (
            unvisited.size === 0 ||
            node === p2
        ) {
            const path: Path = [];
            let n = node;
            while(n !== p1) {
                const prev = previous.get(n);
                if (!prev) {
                    throw new Error('previous missing');
                }
                path.unshift(n);
                n = prev[0];
            }
            return path;
        }

        for (const exit of node.adjacentPoints(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER)) {
            const current = distances.get(exit);
            if (distance + 1 < current) {
                distances.set(exit, distance + 1);
                previous.set(exit, [node]);
            } else if (distance + 1 === current) {
                const prevs = previous.get(exit)!;
                prevs.push(node);
            }
        }
        unvisited.delete(node);
    }
}


export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const steps = input[0].split(',');
    let x = 0;
    let y = 0;
    let maxDist = 0;
    for (const step of steps) {
        switch (step) {
            case 'nw':
                x--; y--;
                break;
            case 'n':
                y -= 2;
                break;
            case 'ne':
                x++; y--;
                break;
            case 'se':
                x++; y++;
                break;
            case 's':
                y += 2;
                break;
            case 'sw':
                x--; y++;
                break;
        }
        const dist = Math.abs(x)+Math.abs((Math.abs(y)-Math.abs(x))/2);
        maxDist = Math.max(maxDist, dist);
        logger.log(`(${x}, ${y}): dist: ${dist}, maxDist: ${maxDist}`);
    }
    if (part === 1) {
        // console.log(startPoint, '=>', path, '=>', childPoint);
        return Math.abs(x)+Math.abs((Math.abs(y)-Math.abs(x))/2);
    }
    return maxDist;
}

run(__filename, solve);
