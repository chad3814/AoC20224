import { DefaultMap } from "./default-map";
import { LinkedList } from "./list-class";
import { Memoable, memoize } from "./memoize";

type ExitCost<T> = {
    node: GraphNode<T>;
    cost: number;
};

export class GraphNode<T> implements Memoable {
    constructor(
        public value: T,
    ) {
        this.id = GraphNode.count++;
    }

    public addExit(node: GraphNode<T>, cost: number): void {
        this._exits.set(node.value, {node, cost});
    }

    public get exits(): IterableIterator<ExitCost<T>> {
        return this._exits.values();
    }

    public toMemo(): string {
        return `{gn${this.id}}`;
    }

    private id: number;
    private _exits = new Map<T, ExitCost<T>>();
    private static count = 0;
};

export class Graph<T> extends LinkedList<GraphNode<T>> implements Memoable {
    constructor(nodes?: Iterable<GraphNode<T>>) {
        super();
        if (nodes) {
            for (const node of nodes) {
                this.append(node);
            }
        }
    }

    getNode(value: T): GraphNode<T>|null {
        return this.find(
            node => node.value.value === value
        )?.value ?? null;
    }

    @memoize(2)
    dijkstra(start: GraphNode<T>, end?: GraphNode<T>) {
        const distances = new DefaultMap<GraphNode<T>, number>(Number.POSITIVE_INFINITY);
        const unvisited = new Set<GraphNode<T>>(this.values());
        const previous = new Map<GraphNode<T>, GraphNode<T>[]>();
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

    minDistance(start: GraphNode<T>, visited: Set<GraphNode<T>> = new Set<GraphNode<T>>()): number {
        visited.add(start);
        let min = Number.POSITIVE_INFINITY;
        if ([...start.exits].every(
            e => visited.has(e.node)
        )) return 0;

        for (const exit of start.exits) {
            if (visited.has(exit.node)) continue;
            if (exit.cost < min) {
                const nextVisisted = new Set<GraphNode<T>>(visited.values());
                const next = this.minDistance(exit.node, nextVisisted);
                min = Math.min(min, exit.cost + next);
            }
        }
        return min;
    }

    maxDistance(start: GraphNode<T>, visited: Set<GraphNode<T>> = new Set<GraphNode<T>>()): number {
        visited.add(start);
        let max = 0;
        if ([...start.exits].every(
            e => visited.has(e.node)
        )) return 0;

        for (const exit of start.exits) {
            if (visited.has(exit.node)) continue;
            const nextVisisted = new Set<GraphNode<T>>(visited.values());
            const next = this.maxDistance(exit.node, nextVisisted);
            max = Math.max(max, exit.cost + next);
        }
        if (max === 0) {
            console.log('weird result from', start.value);
        }
        return max;
    }

    public toMemo(): string {
        return `gg{${this.length},[${this.head?.value.toMemo()},${this.tail?.value.toMemo()}]}`;
    }
}

function getSmallest<T>(unvisited: Set<GraphNode<T>>, distances: DefaultMap<GraphNode<T>, number>): GraphNode<T> {
    const nodes = [...unvisited.keys()].sort(
        (a, b) => distances.get(a) - distances.get(b)
    );
    return nodes[0];
}

function getLargest<T>(unvisited: Set<GraphNode<T>>, distances: DefaultMap<GraphNode<T>, number>): GraphNode<T> {
    const nodes = [...unvisited.keys()].sort(
        (a, b) => distances.get(b) - distances.get(a)
    );
    return nodes[0];
}
