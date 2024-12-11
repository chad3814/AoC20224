import { NotImplemented, run } from "aoc-copilot";
import { inspect } from "util";
import { breadthFirstSearch, depthFirstSearch, filterGraph, filterGraphByValue, Graph, GraphNode, graphNode, LinkedList, llAppendList, llToString, makeGraph, makeLinkedList } from "./list-graph";

type AdditionalInfo = {
    [key: string]: string;
};

function transform(x: number): number[] {
    if (transform.map.has(x)) {
        return transform.map.get(x)!;
    }
    if (x === 0) {
        return [1];
    }
    const y = x.toString(10);
    if (y.length % 2 === 0) {
        const z = [parseInt(y.substring(0, y.length / 2)), parseInt(y.substring(y.length / 2))];
        transform.map.set(x, z);
        return z;
    }
    transform.map.set(x, [x*2024]);
    return [x * 2024];
}
transform.map = new Map<number,number[]>();

function makeNodes(graph: Graph<number>, node: GraphNode<number>, maxLevel: number, target?: number) {
    target = target ?? node.value;
    if (maxLevel < 1) {
        return;
    }
    const stones = transform(node.value);
    for (const stone of stones) {
        const n = graph.allNodes.get(stone) ?? {
            value: stone,
            nodes: [],
            visited: false,
        };
        node.nodes.push(n);
        graph.allNodes.set(stone, n);
    }
    if (stones.includes(target)) {
        return;
    }
    for (const n of node.nodes) {
        if (n.nodes.length === 0) {
            makeNodes(graph, n, maxLevel - 1, target);
        }
    }
}

function findParent(root: GraphNode<number>, child: GraphNode<number>): {length: number, parent: GraphNode<number>} {
    let path = breadthFirstSearch(root.nodes[0], (
        node => node === child
    ));
    if (!path) {
        if (root.nodes.length === 1) {
            throw new Error('failed to find node ' + child.value);
        }
        path = makeLinkedList<GraphNode<number>>([]);
    }

    if (root.nodes.length === 2) {
        const path2 = breadthFirstSearch(root.nodes[1], (
            node => node === child
        ));
        if (path2 && path.length > path2.length) {
            path = path2;
        }
    }
    if (!path?.tail?.prev) {
        throw new Error('parent not found ' + child.value);
    }
    return {
        length: path.length - 1,
        parent: path.tail.prev.value,
    };
}

function nodeCountAtLevel(root: GraphNode<number>, level: number): number {
    if (level < 1) {
        return root.nodes.length;
    }
    let count = 0;
    for (const node of root.nodes) {
        count += nodeCountAtLevel(node, level - 1);
    }
    return count;
}

function nodeValuesAtLevel(root: GraphNode<number>, level: number): LinkedList<number> {
    if (level < 1) {
        return makeLinkedList(root.nodes.map(n => n.value));
    }
    const list = makeLinkedList([]);
    for (const node of root.nodes) {
        const levelList = nodeValuesAtLevel(node, level - 1);
        llAppendList(list, levelList);
    }
    return list;
}

function part1(stones: number[], level: number): number {
    for (let i = 0; i < level; i++) {
        // console.log('level', i, ' - ', stones.join(','));
        stones = stones.map(s => transform(s)).flat();
    }
    console.log('level', level, ' - ', stones.join(','));
    return stones.length;
}

function genGraph(stones: number[]): Graph<number> {
    const graph = makeGraph<number>();
    const queue: GraphNode<number>[] = [];
    for (const stone of stones) {
        const root = graph.allNodes.get(stone) ?? graphNode(stone);
        queue.push(root);
        graph.allNodes.set(stone, root);
    }
    while (queue.length > 0) {
        const root = queue.shift()!;
        if (root.nodes.length > 0) {
            continue;
        }
        makeNodes(graph, root, 100000);
    }
    return graph;
}

function part2(stones: number[], level: number): number {
    const graph = genGraph(stones);
    // console.log('graph size:', graph.allNodes.size);
    const root: GraphNode<number> = {
        value: -1,
        nodes: [],
        visited: false,
    };
    for (const stone of stones) {
        const node = graph.allNodes.get(stone);
        if (!node) {
            throw new Error('no root ' + stone);
        }
        root.nodes.push(node);
    }

    const levelStones = nodeValuesAtLevel(root, level);
    console.log('level', level, ' - ', llToString(levelStones));

    return nodeCountAtLevel(root, level);
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let stones = input[0].split(/\s+/gu).map(i => parseInt(i, 10));
    if (part === 1) {
        return part2(stones, 25);
    }
    return part2(stones, 75);
}

// run(__filename, solve);
const myInput = '0 27 5409930 828979 4471 3 68524 170';
const stones = myInput.split(' ').map(i => parseInt(i, 10));
const graph = genGraph(stones);
const parents = filterGraph(graph, node => node.nodes.map(n => n.value).includes(3));
console.log(parents.map(p => p.value));
// for (const stone of stones) {
//     const node = graph.allNodes.get(stone)!;
//     try {
//         const {length, parent} = findParent(node, node);
//         console.log('length:', length, 'stone:', stone, 'parent:', parent);
//         console.log('values at', length, llToString(nodeValuesAtLevel(node, length)));
//     } catch (err) {
//         console.log('stone', stone, 'does not repeat');
//     }
// }
// const p1 = part1(myInput.split(' ').map(i => parseInt(i, 10)), 30);
// const p2 = part2(graph, 30);
// console.log('\n\n');
// console.log(p1);
// console.log(p2);