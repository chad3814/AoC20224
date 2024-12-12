import { NotImplemented, run } from "aoc-copilot";
import { Direction, filterGraph, Graph, GraphNode, graphReset, make2dGraph } from "./list-graph";
import { inspect } from "util";

type AdditionalInfo = {
    [key: string]: string;
};

function floodFill(node: GraphNode<string>) {
    if (node.visited) {
        return;
    }
    node.visited = true;
    for (const n of node.nodes) {
        floodFill(n);
    }
}

function getPlot(graph: Graph<string>, node: GraphNode<string>): GraphNode<string>[] {
    floodFill(node);
    const plot = filterGraph(graph,
        node => node.visited
    );
    graphReset(graph);
    return plot;
}

function key(x: number, y: number): string {
    return `${x}-${y}`;
}

function getArea(plot: GraphNode<string>[]): number {
    return plot.length;
}

function getPerimeter(plot: GraphNode<string>[]): number {
    let count = 0;
    for (const node of plot) {
        count += 4 - node.nodes.length;
    }
    return count;
}

function dForward(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'north';
    if (direction === Direction.EAST) return 'east';
    if (direction === Direction.SOUTH) return 'south';
    return 'west';
}

function dLeft(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'west';
    if (direction === Direction.EAST) return 'north';
    if (direction === Direction.SOUTH) return 'east';
    return 'south';
}

function dRight(direction: Direction): 'north'|'east'|'south'|'west' {
    if (direction === Direction.NORTH) return 'east';
    if (direction === Direction.EAST) return 'south';
    if (direction === Direction.SOUTH) return 'west';
    return 'north';
}

function turnLeft(direction: Direction): Direction {
    if (direction === Direction.NORTH) return Direction.WEST;
    if (direction === Direction.EAST) return Direction.NORTH;
    if (direction === Direction.SOUTH) return Direction.EAST;
    return Direction.SOUTH;
}

function turnRight(direction: Direction): Direction {
    if (direction === Direction.NORTH) return Direction.EAST;
    if (direction === Direction.EAST) return Direction.SOUTH;
    if (direction === Direction.SOUTH) return Direction.WEST;
    return Direction.NORTH;
}

function dIndex(direction: Direction): 0|1|2|3 {
    if (direction === Direction.NORTH) return 0;
    if (direction === Direction.EAST) return 1;
    if (direction === Direction.SOUTH) return 2;
    return 3;
}

function decCount<T>(map: Map<T,number>, key: T): void {
    const value = map.get(key);
    if (value == null) {
        throw new Error('key missing');
    }
    if (value == 0) {
        throw new Error('0 value');
    }
    map.set(key, value - 1);
}

function getSides(nodes: GraphNode<string>[]): number {
    let sides = 0;
    let direction = Direction.EAST;

    const visitsNeeded = new Map<string, [boolean, boolean, boolean, boolean]>();
    for (const n of nodes) {
        visitsNeeded.set(n.value, [
            !!n[dForward(Direction.NORTH)],
            !!n[dForward(Direction.EAST)],
            !!n[dForward(Direction.SOUTH)],
            !!n[dForward(Direction.WEST)],
        ]);
    }

    function pickNode(): GraphNode<string>|null {
        let target: GraphNode<string>|null = null;
        for (const [key, needed] of visitsNeeded.entries()) {
            target = nodes.find(
                n => n.value === key
            ) ?? null;
            if (target == null) {
                throw new Error('key not found');
            }

            if (!target[dForward(Direction.NORTH)]) {
                continue;
            }
            return target;
        }
        return null;
    }

    let node: GraphNode<string>|null = null;
    while(node = pickNode()) {
        console.log('picked', node.value);
        const startX = node.x;
        const startY = node.y;
        let x = node.x;
        let y = node.y;

        do {
            node.visited = true;
            while(node[dForward(direction)] && !node[dLeft(direction)]) {
                node = node[dForward(direction)]!;

                const needed = visitsNeeded.get(node.value);
                if (!needed) {
                    throw new Error;
                }
                needed[dIndex(direction)] = false;
                visitsNeeded.set(node.value, needed);

                x = node.x;
                y = node.y;
            }
            if (node[dLeft(direction)]) {
                direction = turnLeft(direction);
                node = node[dForward(direction)]!;

                const needed = visitsNeeded.get(node.value);
                if (!needed) {
                    throw new Error;
                }
                needed[dIndex(direction)] = false;
                visitsNeeded.set(node.value, needed);

                x = node.x;
                y = node.y;
            } else {
                direction = turnRight(direction);
            }
            sides++;
        } while(x !== startX || y !== startY || direction !== Direction.EAST);
    }
    return sides;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const graph = make2dGraph<string>(input,
        (value, x, y) => value + ':' + key(x, y),
        (a, b) => a.split(':')[0] === b.split(':')[0],
    );
    // console.log(inspect(graph, false, null, true));

    const map = new Map<string, GraphNode<string>[]>();
    const set = new Set<string>();
    for (const node of graph.allNodes.values()) {
        if (set.has(key(node.x, node.y))) {
            continue;
        }
        const plot = getPlot(graph, node);
        const plotX = Math.min(...plot.map(n => n.x));
        const plotY = Math.min(...plot.map(n => n.x === plotX ? n.y : Number.POSITIVE_INFINITY));
        map.set(key(plotX, plotY), plot);
        for (const n of plot) {
            set.add(key(n.x, n.y));
        }
    }

    if (part === 1) {
        let cost = 0;
        for (const plot of map.values()) {
            const area = getArea(plot);
            const perimeter = getPerimeter(plot);
            cost += area * perimeter;
        }
        return cost;
    }
    let cost = 0;
    for (const plot of map.values()) {
        const area = getArea(plot);
        const sides = getSides(plot);
        console.log(plot[0].value, sides);
        cost += area * sides;
    }
    return cost;
}

// run(__filename, solve);
run(__filename, solve, undefined, {
    reason: 'multiple',
    part1length: 3,
    inputs: {
        selector: 'code',
        indexes: [0,25,54,0,25,99,106,54],
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [47,52,77,94,97,104,105,137]
    }
});
