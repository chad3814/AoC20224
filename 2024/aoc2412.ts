import { NotImplemented, run } from "aoc-copilot";
import { dForward, dIndex, Direction, dLeft, filterGraph, Graph, GraphNode, graphReset, make2dGraph, turnLeft, turnRight } from "../utils/list-graph";

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

const d: {[s: string]: Direction} = {
    [dForward(Direction.NORTH)]: Direction.NORTH,
    [dForward(Direction.EAST)]: Direction.EAST,
    [dForward(Direction.SOUTH)]: Direction.SOUTH,
    [dForward(Direction.WEST)]: Direction.WEST,
};

function getSides(nodes: GraphNode<string>[]): number {
    let sides = 0;
    let direction = Direction.EAST;

    const visitsNeeded = new Map<GraphNode<string>, [boolean, boolean, boolean, boolean]>();
    for (const n of nodes) {
        visitsNeeded.set(n, [
            !n[dForward(Direction.NORTH)],
            !n[dForward(Direction.EAST)],
            !n[dForward(Direction.SOUTH)],
            !n[dForward(Direction.WEST)],
        ]);
    }

    function pickNode(): GraphNode<string>|null {
        for (const [target, needed] of visitsNeeded.entries()) {
            if (!needed[dIndex(Direction.NORTH)]) {
                continue;
            }
            return target;
        }
        return null;
    }

    let node: GraphNode<string>|null = null;
    while(node = pickNode()) {
        const startX = node.x;
        const startY = node.y;
        let x = node.x;
        let y = node.y;
        direction = Direction.EAST;

        do {
            while(node[dForward(direction)] && !node[dLeft(direction)]) {
                const needed = visitsNeeded.get(node);
                if (!needed) {
                    throw new Error;
                }
                needed[dIndex(d[dLeft(direction)])] = false;
                visitsNeeded.set(node, needed);

                node = node[dForward(direction)]!;
                x = node.x;
                y = node.y;
            }
            if (node[dLeft(direction)]) {
                direction = turnLeft(direction);

                node = node[dForward(direction)]!;
                x = node.x;
                y = node.y;
            } else {
                const needed = visitsNeeded.get(node);
                if (!needed) {
                    throw new Error;
                }
                needed[dIndex(d[dLeft(direction)])] = false;
                visitsNeeded.set(node, needed);
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
