import { Direction, Turn } from "./direction";
import { memoize } from "./memoize";
import { Path, Point } from "./point";

function getTurns(p1: Point, p2: Point, p3: Point): Turn[] {
    if (p1.x === p2.x && p2.x === p3.x) {
        if (p1.y === p3.y) {
            return [Turn.UTURN, Turn.STRAIGHT];
        }
        return [Turn.STRAIGHT];
    }

    if (p1.y === p2.y && p2.y === p3.y) {
        if (p1.x === p3.x) {
            return [Turn.UTURN, Turn.STRAIGHT];
        }
        return [Turn.STRAIGHT];
    }

    if (p1.x === p2.x) {
        const dir1 = p1.y < p2.y ? Direction.DOWN : Direction.UP;
        const dir2 = p2.x < p3.x ? Direction.EAST : Direction.WEST;
        if (dir2 === Direction.EAST) {
            return dir1 === Direction.DOWN ? [Turn.LEFT, Turn.STRAIGHT] : [Turn.RIGHT, Turn.STRAIGHT];
        }
        return dir1 === Direction.DOWN ? [Turn.RIGHT, Turn.STRAIGHT] : [Turn.LEFT, Turn.STRAIGHT];
    }

    const dir1 = p1.x < p2.x ? Direction.RIGHT : Direction.LEFT;
    const dir2 = p2.y < p3.y ? Direction.SOUTH : Direction.NORTH;
    if (dir2 === Direction.SOUTH) {
        return dir1 === Direction.RIGHT ? [Turn.LEFT, Turn.STRAIGHT] : [Turn.RIGHT, Turn.STRAIGHT];
    }
    return dir1 === Direction.RIGHT ? [Turn.RIGHT, Turn.STRAIGHT] : [Turn.LEFT, Turn.STRAIGHT];
}

export class Graph {
    constructor(input: string[] | string[][], private passable = '.', private impassable = '#') {
        for (let y = 0; y < input.length; y++) {
            const row: string[] = [];
            for (let x = 0; x < input[y].length; x++) {
                const cell = input[y][x];
                row.push(cell);
                if (cell !== passable && cell !== impassable) {
                    const points = this.poi.get(cell) ?? [];
                    points.push(Point.p(x, y));
                    this.poi.set(cell, points);
                }
            }
            this.grid.push(row);
        }
        this.height = this.grid.length;
        this.width = this.grid[0].length;
    }

    public get pointsOfInterest() {
        return new Map(this.poi.entries());
    }

    @memoize()
    public allPaths(p1: Point, p2: Point, visited: Set<Point> = new Set()): Path[] {
        const paths: Path[] = [];
        if (p1 === p2) {
            return [[p2]];
        }
        visited.add(p1);
        for (const p3 of p1.adjacentPoints(this.width, this.height)) {
            if (this.grid[p3.y][p3.x] !== this.impassable && !visited.has(p3)) {
                const subpaths = this.allPaths(p3, p2, visited);
                for (const subpath of subpaths) {
                    if (subpath[subpath.length - 1] !== p2) {
                        throw new Error('path ended wrong');
                    }
                    paths.push([p1, ...subpath]);
                }
            }
        }
        visited.delete(p1);
        return paths;
    }

    print(valueMap: (value: string, p: Point)=>string = v=>v): void {
        for (let y = 0; y < this.grid.length; y++) {
            const line: string[] = [];
            for (let x = 0; x < this.grid[y].length; x++) {
                line.push(valueMap(this.grid[y][x], Point.p(x, y)));
            }
            console.log(line.join(''));
        }
    }

    public readonly width: number;
    public readonly height: number;

    private poi = new Map<string, Point[]>();
    private grid: string[][] = [];
}

export const turnsFromPath = memoize<void, [Direction, Path], Turn[]>(2)(
    (startingDirection: Direction, path: Path): Turn[] => {
        if (path.length < 2) {
            throw new Error('Need two path nodes');
        }
        const turns: Turn[] = [];
        if (startingDirection === Direction.NORTH) {
            turns.push(...getTurns(Point.p(path[0].x, path[0].y + 1), path[0], path[1]));
        } else if (startingDirection === Direction.EAST) {
            turns.push(...getTurns(Point.p(path[0].x - 1, path[0].y), path[0], path[1]));
        } else if (startingDirection === Direction.SOUTH) {
            turns.push(...getTurns(Point.p(path[0].x, path[0].y - 1), path[0], path[1]));
        } else {
            turns.push(...getTurns(Point.p(path[0].x + 1, path[0].y), path[0], path[1]));
        }

        for (let i = 2; i < path.length; i++) {
            turns.push(...getTurns(path[i - 2], path[i - 1], path[i]));
        }
        return turns;
    }
);
