import { DefaultMap } from "./default-map";
import { LinkedList } from "./list-class";

export enum Direction {
    NORTH = 0,
    UP = 0,
    EAST = 1,
    RIGHT = 1,
    SOUTH = 2,
    DOWN = 2,
    WEST = 3,
    LEFT = 3,
};

const OPPOSITES = {
    [Direction.NORTH]: Direction.SOUTH,
    [Direction.EAST]: Direction.WEST,
    [Direction.SOUTH]: Direction.NORTH,
    [Direction.WEST]: Direction.EAST,
};

export class Point {
    public static p(x: number, y: number) {
        let p = this.points.get(`${x}-${y}`);
        if (p) return p;
        p = new Point(x, y);
        this.points.set(`${x}-${y}`, p);
        return p;
    }

    public adjacentPoints(maxX: number, maxY: number, minX = 0, minY = 0): Point[] {
        const points: Point[] = [];
        if (this.x > minX) {
            points.push(Point.p(this.x - 1, this.y));
        }
        if (this.x < maxX) {
            points.push(Point.p(this.x + 1, this.y));
        }
        if (this.y > minY) {
            points.push(Point.p(this.x, this.y - 1));
        }
        if (this.y < maxY) {
            points.push(Point.p(this.x, this.y + 1));
        }

        return points;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }

    private constructor(public readonly x: number, public readonly y: number) {}
    private static points: Map<string, Point> = new Map<string, Point>();
}

export type Path = Point[];

export type MazeNode = {
    facing: Direction;
    value: string;
    point: Point;
    exits: {
        node: MazeNode;
        cost: number;
    }[];
};

function validPoint(grid: string[], point: Point): boolean {
    if (
        point.x < 0 ||
        point.y < 0 ||
        point.y >= grid.length ||
        point.x >= grid[point.y].length
    ) return false;
    return true;
}

export function parseMaze(lines: string[], impassable = '#'): LinkedList<MazeNode> {
    const list = new LinkedList<MazeNode>();
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const value = lines[y][x];
            if (value === impassable) continue;
            for(const facing of [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST]) {
                const node: MazeNode = {
                    facing,
                    value,
                    point: Point.p(x, y),
                    exits: [],
                };
                list.append(node);
            }
        }
    }
    for (const {value: node} of list) {
        const {facing, point} = node;
        const {x, y} = point;
        for(const [exiting, point] of [
            [Direction.NORTH, Point.p(x, y - 1)],
            [Direction.EAST, Point.p(x + 1, y)],
            [Direction.SOUTH, Point.p(x, y + 1)],
            [Direction.WEST, Point.p(x - 1, y)]
        ] as [Direction, Point][]) {
            if (
                validPoint(lines, point) &&
                lines[point.y][point.x] !== impassable
            ) {
                const exitNode = list.find(
                    n => n.value.point === point
                );
                if (!exitNode) {
                    throw new Error('Missing Node');
                }
                if (facing === exiting) {
                    node.exits.push({
                        node: exitNode.value,
                        cost: 1,
                    });
                } else if (OPPOSITES[facing] === exiting) {
                    node.exits.push({
                        node: exitNode.value,
                        cost: 2001,
                    });
                } else {
                    node.exits.push({
                        node: exitNode.value,
                        cost: 1001,
                    });
                }
            }
        }
    }
    return list;
}



export function dijkstra(nodes: LinkedList<MazeNode>, start: MazeNode, end?: MazeNode) {
    const distances = new DefaultMap<MazeNode, number>(Number.POSITIVE_INFINITY);
    const unvisited = new Set<MazeNode>(nodes.values());
}
