import { NotImplemented, run } from "aoc-copilot";
import { Direction, Turn } from "../utils/direction";
import { dijkstra, parseWeightedMaze } from "../utils/maze";
import { Point } from "../utils/point";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const maze = parseWeightedMaze(input);
    const start = maze.find(
        node => node.value.value === 'S' && node.value.facing === Direction.EAST
    )?.value;
    if (!start) {
        throw new Error('no find start');
    }
    const end = maze.find(
        ({value: node}) => node.value === 'E' && node.facing === Direction.NORTH
    )?.value;
    if (!end) {
        throw new Error('no find end');
    }
    const {distances, previous} = dijkstra(maze, start, end);

    if (part === 1) {
        return distances.get(end);
    }

    const points = new Set<Point>();
    let node = previous.get(end);
    if (!node) {
        console.log(`uh oh the end isn't in the previous map`);
        throw new Error('map error');
    }
    while (node !== start) {
        points.add(node.point);
        node = previous.get(node!);
        if (!node) {
            console.log('no previous');
            throw new Error('map error');
        }
    }

    const {distances: revDists, previous: revPrev} = dijkstra(maze, end, start);
    node = revPrev.get(start);
    if (!node) {
        console.log('missing revPrev start');
        throw new Error();
    }
    while (node !== end) {
        points.add(node.point);
        node = revPrev.get(node!);
        if (!node) {
            console.log('no revPrev');
            throw new Error();
        }
    }

    return points.size;
}

type AocCopilotOptions = {
    testsOnly?: boolean;
    skipTests?: boolean;
    onlyPart?: 1|2;
};
const options: AocCopilotOptions = {}

const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
