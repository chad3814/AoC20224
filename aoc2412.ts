import { NotImplemented, run } from "aoc-copilot";
import { filterGraph, Graph, GraphNode, graphReset, make2dGraph } from "./list-graph";
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

function getSides(plot: GraphNode<string>[]): number {

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
        cost += area * sides;
    }
    return cost;
}

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
