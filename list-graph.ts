export type Node<T> = {
    value: T;
    next: Node<T> | null;
    prev: Node<T> | null;
    visited: boolean;
    linkedList: LinkedList<T>;
};

type NonEmptyLinkedList<T> = {
    head: Node<T>;
    tail: Node<T>;
    length: number;
}

type EmptyLinkedList = {
    head: null;
    tail: null;
    length: 0;
}

export type LinkedList<T> = NonEmptyLinkedList<T> | EmptyLinkedList;

export function llAppend<T>(list: LinkedList<T>, value: T): Node<T> {
    const node: Node<T> = {
        value,
        next: null,
        prev: list.tail,
        visited: false,
        linkedList: list,
    };
    if (list.tail) {
        list.tail.next = node;
    } else {
        (list as unknown as NonEmptyLinkedList<T>).head = node;
    }
    list.length++;
    list.tail = node;
    return node;
}

export function llAppendNode<T>(list: LinkedList<T>, node: Node<T>) {
    if (list.tail) {
        list.tail.next = node;
    } else {
        (list as unknown as NonEmptyLinkedList<T>).head = node;
    }
    node.prev = list.tail;
    node.next = null;
    list.tail = node;
    list.length++;
}

export function llPrepend<T>(list: LinkedList<T>, value: T): Node<T> {
    const node: Node<T> = {
        value,
        next: list.head,
        prev: null,
        visited: false,
        linkedList: list,
    };
    if (list.head) {
        list.head.prev = node;
    } else {
        (list as unknown as NonEmptyLinkedList<T>).tail = node;
    }
    list.length++;
    list.head = node;
    return node;
}

export function llPrependNode<T>(list: LinkedList<T>, node: Node<T>) {
    if (list.head) {
        list.head.prev = node;
    } else {
        (list as unknown as NonEmptyLinkedList<T>).tail = node;
    }
    node.next = list.head;
    node.prev = null;
    list.head = node;
    list.length++;
}

export function llInsertBefore<T>(target: Node<T>, value: T): Node<T> {
    const node: Node<T> = {
        value,
        next: target,
        prev: target.prev,
        visited: false,
        linkedList: target.linkedList,
    };
    if (target.prev) {
        target.prev.next = node;
    }
    target.prev = node;
    target.linkedList.length++;
    if (target.linkedList.head === target) {
        target.linkedList.head = node;
    }
    return node;
}

export function llInsertAfter<T>(target: Node<T>, value: T): Node<T> {
    const node: Node<T> = {
        value,
        next: target.next,
        prev: target,
        visited: false,
        linkedList: target.linkedList,
    };
    if (target.next) {
        target.next.prev = node;
    }
    target.next = node;
    target.linkedList.length++;
    if (target.linkedList.tail === target) {
        target.linkedList.tail = node;
    }
    return node;
}

export function makeLinkedList<T>(values: T[]): LinkedList<T> {
    if (values.length === 0) {
        return {
            head: null,
            tail: null,
            length: 0
        };
    }
    const linkedList: LinkedList<T> = {
        head: null,
        tail: null,
        length: 0,
    };
    for (const value of values) {
        llAppend(linkedList, value);
    }
    return linkedList;
}

export function llReset<T>(list: LinkedList<T>): void {
    let node = list.head;
    while (node !== null) {
        node.visited = false;
        node = node.next;
    }
}

export function llEach<T>(list: LinkedList<T>, predicate: (node: Node<T>) => void): void {
    let node = list.head;
    while (node != null) {
        predicate(node);
        node = node.next;
    }
}

export function llDupe<T>(list: LinkedList<T>): LinkedList<T> {
    const list2: LinkedList<T> = makeLinkedList([]);
    llEach(list, (node => llAppend(list2, node.value)));
    return list2;
}

export function llShift<T>(list: LinkedList<T>): Node<T>|null {
    const node = list.head;
    if (node?.next) {
        node.next.prev = null;
    }
    if (node) {
        list.length--;
    }
    return node;
}

export function llPop<T>(list: LinkedList<T>): Node<T>|null {
    const node = list.tail;
    if (node?.prev) {
        node.prev.next = null;
    }
    if (node) {
        list.length--;
    }
    return node;
}

export function llRemove<T>(node: Node<T>): number {
    if (node.prev) {
        node.prev.next = node.next;
    }
    if (node.next) {
        node.next.prev = node.prev;
    }
    node.linkedList.length--;
    if (node.linkedList.head === node) {
        node.linkedList.head = node.next!;
    }
    if (node.linkedList.tail === node) {
        node.linkedList.tail = node.prev!;
    }
    return node.linkedList.length;
}

function merge<T>(a: LinkedList<T>, b: LinkedList<T>, predicate: (a: T, b: T) => number): LinkedList<T> {
    const list = makeLinkedList<T>([]);

    while (a.length > 0 && b.length > 0) {
        if (predicate(a.head!.value, b.head!.value) < 0) {
            llAppendNode<T>(list, llShift<T>(a)!);
        } else {
            llAppendNode<T>(list, llShift<T>(b)!);
        }
    }
    while (a.length > 0) {
        llAppendNode<T>(list, llShift<T>(a)!);
    }
    while (b.length > 0) {
        llAppendNode<T>(list, llShift<T>(b)!);
    }
    return list;
}

export function llSort<T>(list: LinkedList<T>, predicate: (a: T, b: T) => number): LinkedList<T> {
    if (list.length <= 1) {
        return list;
    }

    let left = makeLinkedList<T>([])
    let right = makeLinkedList<T>([]);
    for (let i = 0; i < list.length; i++) {
        if (i < list.length / 2) {
            llAppendNode(left, llShift(list)!);
        } else {
            llAppendNode(right, llShift(list)!);
        }
    }
    left = llSort(left, predicate);
    right = llSort(right, predicate);
    return merge(left, right, predicate);
}

export function llAppendList<T>(list1: LinkedList<T>, list2: LinkedList<T>): LinkedList<T> {
    let node = list2.head;
    while (node != null) {
        const next = node.next;
        llAppendNode(list1, node);
        node = next;
    }
    return list1;
}

export function llToString<T>(list: LinkedList<T>, separator = ','): string {
    let node = list.head;
    let first = true;
    let str = '';
    while (node != null) {
        if (!first) {
            str += separator;
        }
        first = false;
        str += node.value;
        node = node.next;
    }
    return str;
}

export enum Direction {
    NORTH,
    EAST,
    SOUTH,
    WEST
};

type NorthOffset = {
    [Direction.NORTH]: [-1|0|1, -1|0|1];
};
type EastOffset = {
    [Direction.EAST]: [-1|0|1, -1|0|1];
};
type SouthOffset = {
    [Direction.SOUTH]: [-1|0|1, -1|0|1];
};
type WestOffset = {
    [Direction.WEST]: [-1|0|1, -1|0|1];
};

const DIRECTION_OFFSETS: NorthOffset&EastOffset&SouthOffset&WestOffset = {
    [Direction.NORTH]: [0, -1],
    [Direction.EAST]: [1, 0],
    [Direction.SOUTH]: [0, 1],
    [Direction.WEST]: [-1, 0],
};

export type GraphNode<T> = Omit<Node<T>, 'next'|'prev'|'linkedList'>  & {
    nodes: GraphNode<T>[];
    x: number;
    y: number;
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
                const offset = DIRECTION_OFFSETS[direction];
                const x2 = x + offset[0];
                const y2 = y + offset[1];

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
