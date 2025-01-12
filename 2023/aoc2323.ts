import { NotImplemented, run } from "aoc-copilot";
import { Maze, MazeNode } from "../utils/maze";
import { Path, Point } from "../utils/point";
import { memoize } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};

const getPaths = memoize<void, [MazeNode, MazeNode], Path[]>(2)((start: MazeNode, end: MazeNode): Path[] => {
    const paths: Path[] = [];
    if (start === end) {
        return [[start.point]];
    }
    start.visited = true;
    for (const exit of start.exits) {
        if (exit.node.visited) {
            continue;
        }
        const subpaths = getPaths(exit.node, end);
        for (const subpath of subpaths) {
            paths.push([start.point, ...subpath]);
        }
        exit.node.visited = false;
    }
    return paths;
});

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const maze = new Maze(input, false);
    for (const node of maze) {
        if (node.value.value === '>') {
            if (node.value.exits.length > 1) {
                const exitPoint = Point.p(node.value.point.x + 1, node.value.point.y);
                node.value.exits = node.value.exits.filter(
                    exit => exit.node.point === exitPoint
                );
            }
        } else if (node.value.value === 'v') {
            if (node.value.exits.length > 1) {
                const exitPoint = Point.p(node.value.point.x, node.value.point.y + 1);
                node.value.exits = node.value.exits.filter(
                    exit => exit.node.point === exitPoint
                );
            }
        } else if (node.value.value === '<') {
            if (node.value.exits.length > 1) {
                const exitPoint = Point.p(node.value.point.x - 1, node.value.point.y);
                node.value.exits = node.value.exits.filter(
                    exit => exit.node.point === exitPoint
                );
            }
        } else if (node.value.value === '^') {
            if (node.value.exits.length > 1) {
                const exitPoint = Point.p(node.value.point.x, node.value.point.y - 1);
                node.value.exits = node.value.exits.filter(
                    exit => exit.node.point === exitPoint
                );
            }
        }
    }
    const startIndex = input[0].indexOf('.');
    const start = maze.getNode(Point.p(startIndex, 0));
    if (!start) {
        throw new Error('no start found');
    }
    const endIndex = input[input.length - 1].indexOf('.');
    const end = maze.getNode(Point.p(endIndex, input.length - 1));
    if (!end) {
        throw new Error('no end found');
    }
    if (part === 1) {
        const {distances} = maze.reverseDijkstra(start, end);
        console.log(distances);
        return distances.get(end);
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
