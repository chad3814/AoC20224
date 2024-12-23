import { DefaultMap } from "./default-map";
import { Direction, OppositeDirection } from "./direction";
import { LinkedList } from "./list-class";
import { Memoable, memoize } from "./memoize";
import { Point } from "./point";

export class MazeNode implements Memoable {
    constructor(
        public value: string,
        public readonly point: Point,
        public facing: Direction = Direction.NORTH
    ) {}

    public exits: {
        node: MazeNode;
        cost: number;
    }[] = [];

    toMemo() {
        return `{mz${this.point};${this.facing}}`;
    }
};

export class Maze extends LinkedList<MazeNode> {
    get width() { return this._width; }
    get height() { return this._height; }

    constructor(lines: string[], weighted = true, impassable = '#') {
        super();
        this._height = lines.length;
        this._width = lines[0].length;

        if (weighted)
            this.parseWeighted(lines, impassable);
        else
            this.parseUnweighted(lines, impassable);
    }

    @memoize(1)
    getNode(point: Point): MazeNode|null {
        return this.find(
            node => node.value.point === point
        )?.value ?? null;
    }

    @memoize(1)
    validPoint(point: Point): boolean {
        if (
            point.x < 0 ||
            point.y < 0 ||
            point.x >= this.width ||
            point.y >= this.height
        ) return false;
        return true;
    }

    @memoize(2)
    dijkstra(start: MazeNode, end?: MazeNode) {
        const distances = new DefaultMap<MazeNode, number>(Number.POSITIVE_INFINITY);
        const unvisited = new Set<MazeNode>(this.values());
        const previous = new Map<MazeNode, MazeNode[]>();
        distances.set(start, 0);
        while (true) {
            const node = getSmallest(unvisited, distances);
            const distance = distances.get(node);
            if (
                unvisited.size === 0 ||
                (end && node === end) ||
                distance === Number.POSITIVE_INFINITY
            ) {
                return {distances, previous};
            }

            for (const exit of node.exits) {
                const current = distances.get(exit.node);
                if (distance + exit.cost < current) {
                    distances.set(exit.node, distance + exit.cost);
                    previous.set(exit.node, [node]);
                } else if (distance + exit.cost === current) {
                    const prevs = previous.get(exit.node)!;
                    prevs.push(node);
                }
            }
            unvisited.delete(node);
        }
    }

    private _width: number;
    private _height: number;

    private parseWeighted(lines: string[], impassable: string) {
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                const value = lines[y][x];
                if (value === impassable) continue;
                for(const facing of [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST]) {
                    const node: MazeNode = new MazeNode(value, Point.p(x, y), facing);
                    this.append(node);
                }
            }
        }
        let count = 0;
        for (const {value: node} of this) {
            const {facing, point} = node;
            const {x, y} = point;
            for(const [exiting, point] of [
                [Direction.NORTH, Point.p(x, y - 1)],
                [Direction.EAST, Point.p(x + 1, y)],
                [Direction.SOUTH, Point.p(x, y + 1)],
                [Direction.WEST, Point.p(x - 1, y)]
            ] as [Direction, Point][]) {
                if (
                    validMazePoint(lines, point) &&
                    lines[point.y][point.x] !== impassable
                ) {
                    const en = this.find(
                        ({value}) => value.point === point && value.facing === exiting
                    );
                    if (!en) {
                        throw new Error('Missing Node');
                    }
                    const exitNode = en.value;
                    count++;
                    if (facing === exiting) {
                        node.exits.push({
                            node: exitNode,
                            cost: 1,
                        });
                    } else if (OppositeDirection[facing] === exiting) {
                        node.exits.push({
                            node: exitNode,
                            cost: 2001,
                        });
                    } else {
                        node.exits.push({
                            node: exitNode,
                            cost: 1001,
                        });
                    }
                }
            }
        }
    }

    private parseUnweighted(lines: string[], impassable: string) {
        for (let y = 0; y < lines.length; y++) {
            for (let x = 0; x < lines[y].length; x++) {
                const value = lines[y][x];
                if (value === impassable) continue;
                const node: MazeNode = new MazeNode(value, Point.p(x, y));
                this.append(node);
            }
        }
        for (const {value: node} of this) {
            const {facing, point} = node;
            const {x, y} = point;
            for(const point of [
                Point.p(x, y - 1),
                Point.p(x + 1, y),
                Point.p(x, y + 1),
                Point.p(x - 1, y)
            ]) {
                if (
                    validMazePoint(lines, point) &&
                    lines[point.y][point.x] !== impassable
                ) {
                    const en = this.find(
                        ({value}) => value.point === point
                    );
                    if (!en) {
                        throw new Error('Missing Node');
                    }
                    const exitNode = en.value;
                    node.exits.push({
                        node: exitNode,
                        cost: 1,
                    });
                }
            }
        }
    }
}

export function validMazePoint(grid: string[], point: Point): boolean {
    if (
        point.x < 0 ||
        point.y < 0 ||
        point.y >= grid.length ||
        point.x >= grid[point.y].length
    ) return false;
    return true;
}

export function parseWeightedMaze(lines: string[], impassable = '#'): Maze {
    return new Maze(lines, true, impassable);
}

export function parseUnweightedMaze(lines: string[], impassable = '#'): Maze {
    return new Maze(lines, false, impassable);
}

function getSmallest(unvisited: Set<MazeNode>, distances: DefaultMap<MazeNode, number>): MazeNode {
    const nodes = [...unvisited.keys()].sort(
        (a, b) => distances.get(a) - distances.get(b)
    );
    return nodes[0];
}

export function dijkstra(nodes: Maze, start: MazeNode, end?: MazeNode) {
    return nodes.dijkstra(start, end);
}
