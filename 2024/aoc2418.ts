import { NotImplemented, run } from "aoc-copilot";
import { Point } from "../utils/point";
import { dijkstra, MazeNode, parseUnweightedMaze } from "../utils/maze";
import { LinkedList } from "../utils/list-class";

type AdditionalInfo = {
    [key: string]: string;
};

function makeInput(size: number, points: Point[]): LinkedList<MazeNode> {
    const memory: string[][] = [];
    for (let i = 0; i < size; i++) {
        memory.push('.'.repeat(size).split(''));
    }
    for (const point of points) {
        memory[point.y][point.x] = '#';
    }
    const map = memory.map(m => m.join(''));
    const maze = parseUnweightedMaze(map);
    return maze;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const points: Point[] = [];
    for (const line of input) {
        const [a, b] = line.split(',');
        const point = Point.p(parseInt(a, 10), parseInt(b, 10));
        points.push(point);
    }
    const size = (test?7:71);
    const count = (test?12:1024);
    const maze = makeInput(size, points.slice(0, count));
    const start = maze.find(
        ({value}) => value.point === Point.p(0,0)
    )?.value;
    const end = maze.find(
        ({value}) => value.point === Point.p(size - 1, size - 1)
    )?.value;
    if (!start || !end) {
        throw new Error('missing start or end');
    }

    if (part === 1) {
        const {distances, previous} = dijkstra(maze, start, end);
        return distances.get(end);
    }
    let prev = count;
    let last = Math.floor((points.length + count) / 2);
    for (let i = prev; i < points.length; i++) {
        const newMaze = makeInput(size, points.slice(0, i));
        const start = newMaze.find(
            ({value}) => value.point === Point.p(0,0)
        )?.value;
        const end = newMaze.find(
            ({value}) => value.point === Point.p(size - 1, size - 1)
        )?.value;
        if (!start || !end) {
            throw new Error('missing start or end');
        }
        const {distances: d} = dijkstra(newMaze, start, end);
        // console.log('block', i, 'out of', points.length, points[i], 'distance:', d.get(end));
        if (d.get(end) === Number.POSITIVE_INFINITY) {
            if (i > last) {
                return `${points[i-1].x},${points[i-1].y}`;
            } else if (i === last) {
                i = Math.floor((prev + last) / 2);
                last = i--;
                // console.log('i is last, moving to', last, prev);
            }
        } else if (i !== last) {
            i = Math.floor((last + points.length) / 2);
            prev = last;
            last = i--;
            // console.log('moving forward to', last, prev);
        }
    }
    throw new Error('oops');
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
