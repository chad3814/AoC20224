import { DefaultMap } from "./default-map";
import { Direction, OppositeDirection } from "./direction";
import { LinkedList } from "./list-class";
import { Point } from "./point";

export type MazeNode = {
    facing: Direction;
    value: string;
    point: Point;
    exits: {
        node: MazeNode;
        cost: number;
    }[];
};

export function validMazePoint(grid: string[], point: Point): boolean {
    if (
        point.x < 0 ||
        point.y < 0 ||
        point.y >= grid.length ||
        point.x >= grid[point.y].length
    ) return false;
    return true;
}

export function parseWeightedMaze(lines: string[], impassable = '#'): LinkedList<MazeNode> {
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
    let count = 0;
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
                validMazePoint(lines, point) &&
                lines[point.y][point.x] !== impassable
            ) {
                const en = list.find(
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
    return list;
}

export function parseUnweightedMaze(lines: string[], impassable = '#'): LinkedList<MazeNode> {
    const list = new LinkedList<MazeNode>();
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const value = lines[y][x];
            if (value === impassable) continue;
            const node: MazeNode = {
                facing: Direction.NORTH,
                value,
                point: Point.p(x, y),
                exits: [],
            };
            list.append(node);
        }
    }
    for (const {value: node} of list) {
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
                const en = list.find(
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
    return list;
}

function getSmallest(unvisited: Set<MazeNode>, distances: DefaultMap<MazeNode, number>): MazeNode {
    const nodes = [...unvisited.keys()].sort(
        (a, b) => distances.get(a) - distances.get(b)
    );
    return nodes[0];
}

export function dijkstra(nodes: LinkedList<MazeNode>, start: MazeNode, end?: MazeNode) {
    const distances = new DefaultMap<MazeNode, number>(Number.POSITIVE_INFINITY);
    const unvisited = new Set<MazeNode>(nodes.values());
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
