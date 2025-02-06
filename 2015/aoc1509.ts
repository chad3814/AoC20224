import { argsToOptions, NotImplemented, Options, run } from "aoc-copilot";
import { Graph, GraphNode } from "../utils/generic-graph";
import { inspect } from "util";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /(?<city1>.*?) to (?<city2>.*?) = (?<distance>\d+)/u;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const graph = new Graph<string>();
    for (const line of input) {
        const match = line.match(RE);
        if (!match || !match.groups) {
            throw new Error('RE failure: ' + line);
        }
        const {city1, city2, distance: _d} = match.groups;
        const distance = parseInt(_d, 10);
        let node1 = graph.getNode(city1);
        if (!node1) {
            node1 = new GraphNode(city1);
            graph.append(node1);
        }
        let node2 = graph.getNode(city2);
        if (!node2) {
            node2 = new GraphNode(city2);
            graph.append(node2);
        }
        node1.addExit(node2, distance);
        node2.addExit(node1, distance);
    }

    if (part === 1) {
        let min = Number.POSITIVE_INFINITY;
        for (const node of graph) {
            const distance = graph.minDistance(node.value);
            min = Math.min(min, distance);
        }
        return min;
    }
    let max = 0;
    for (const node of graph) {
        const distance = graph.maxDistance(node.value);
        max = Math.max(max, distance);
    }
    return max;
}

const options: Options = argsToOptions(process.argv);
run(__filename, solve, options);
