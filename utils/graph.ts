import { Direction, DirectionOffset } from "./direction";
import { LinkedList, llAppend, llAppendList, llDupe, makeLinkedList, Node } from "./list";

export type GraphNode<T> = Omit<Node<T>, 'next'|'prev'|'linkedList'>  & {
    nodes: GraphNode<T>[];
    x: number;
    y: number;
    north?: GraphNode<T>,
    east?: GraphNode<T>,
    south?: GraphNode<T>,
    west?: GraphNode<T>,
};

export type Graph<T> = {
    allNodes: Map<T, GraphNode<T>>;
}


export function makeGraph<T>(nodes?: Iterable<GraphNode<T>>): Graph<T> {
    const allNodes = new Map<T, GraphNode<T>>();
    if (nodes) {
        for (const node of nodes) {
            if (!allNodes.has(node.value)) {
                allNodes.set(node.value, node);
            }
        }
    }
    return {
        allNodes: allNodes
    };
}

export function graphNode<T>(value: T, x: number, y: number): GraphNode<T> {
    return {
        value,
        visited: false,
        nodes: [],
        x, y,
    };
}

export function graphReset<T>(graph: Graph<T>) {
    for (const node of graph.allNodes.values()) {
        node.visited = false;
    }
}

export function make2dGraph<T>(
    values: string[][] | string[],
    getValue: (v: string, x: number, y: number) => T,
    joinFunc: (a: T, b: T, x1: number, y1: number, x2: number, y2: number, direction: Direction) => boolean
): Graph<T> {
    const graph = makeGraph<T>();
    const nodes: (null|GraphNode<T>)[][] = new Array(values.length);
    for (let y = 0; y < values.length; y++) {
        nodes[y] = new Array(values[y].length).fill(null);
    }
    for (let y = 0; y < values.length; y++) {
        for (let x = 0; x < values[y].length; x++) {
            let node1: GraphNode<T> = nodes[y][x]!;
            if(!node1) {
                node1 = {
                    value: getValue(values[y][x], x, y),
                    visited: false,
                    nodes: [],
                    x, y,
                };
            }
            nodes[y][x] = node1;
            for (const direction of [Direction.NORTH, Direction.EAST, Direction.SOUTH, Direction.WEST]) {
                const offset = DirectionOffset[direction];
                const x2 = x + offset[0];
                const y2 = y + offset[1];
                const directionKey = direction === Direction.NORTH ?
                    'north' : direction === Direction.EAST ?
                    'east' : direction === Direction.SOUTH ?
                    'south' :
                    'west';
                if (
                    y2 < 0 || y2 >= values.length ||
                    x2 < 0 || x2 >= values[y].length
                ) {
                    continue;
                }

                let node2: GraphNode<T> = nodes[y2][x2]!;
                if (!node2) {
                    node2 = {
                        value: getValue(values[y2][x2], x2, y2),
                        visited: false,
                        nodes: [],
                        x: x2, y: y2,
                    }
                }
                nodes[y2][x2] = node2;
                if (joinFunc(
                    node1.value,
                    node2.value,
                    x, y, x2, y2,
                    direction
                )) {
                    node1.nodes.push(node2);
                    node1[directionKey] = node2;
                }
            }
            graph.allNodes.set(node1.value, node1);
        }
    }
    return graph;
}

export function filterGraph<T>(graph: Graph<T>, predicate: (node: GraphNode<T>) => boolean): GraphNode<T>[] {
    const list: GraphNode<T>[] = [];
    for (const node of graph.allNodes.values()) {
        if (predicate(node)) {
            list.push(node);
        }
    }
    return list;
}

export function filterGraphByValue<T>(graph: Graph<T>, value: T): GraphNode<T>[] {
    return filterGraph(graph, (
        node => node.value === value
    ));
}

type QueueElement<T> = {
    list: LinkedList<GraphNode<T>>;
    node: GraphNode<T>;
};

export function breadthFirstSearch<T>(node: GraphNode<T>, predicate: (node: GraphNode<T>, list: LinkedList<GraphNode<T>>) => boolean): LinkedList<GraphNode<T>>|null {
    const queue: QueueElement<T>[] = [{
        list: makeLinkedList<GraphNode<T>>([]),
        node,
    }];

    while (queue.length > 0) {
        const target = queue.shift()!;
        if (target.node.visited) {
            continue;
        }
        target.node.visited = true;
        if (predicate(target.node, target.list)) {
            llAppend(target.list, target.node);
            return target.list;
        }
        const list = llDupe(target.list);
        llAppend(list, target.node);
        for (const node of target.node.nodes) {
            queue.push({
                list,
                node,
            });
        }
    }
    return null;
}

type GraphList<T> = LinkedList<GraphNode<T>>;
export function depthFirstSearch<T>(node: GraphNode<T>, predicate: (node: GraphNode<T>, list: GraphList<T>) => boolean, list?: GraphList<T>): LinkedList<GraphList<T>> {
    const lists: LinkedList<GraphList<T>> = makeLinkedList([]);
    if (!list) {
        list = makeLinkedList<GraphNode<T>>([]);
    }
    node.visited = true;
    for (const target of node.nodes) {
        if (target.visited) {
            continue;
        }
        const list2: GraphList<T> = llDupe(list);
        llAppend(list2, target);
        if (predicate(target, list2)) {
            llAppend(lists, list2)
        }
        const targetLists = depthFirstSearch(target, predicate, list);
        target.visited = false;
        llAppendList(lists, targetLists);
    }

    return lists;
}
