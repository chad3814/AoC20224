import { Node } from "./list-class";

export type KeyedObject<K> = {
    key: K;
};

export class HeapNode<K, V> extends Node<V> implements KeyedObject<K> {
    public parent: HeapNode<K, V> | null = null;
    public child: HeapNode<K, V> | null = null;
    public degree = 0;
    public isMarked = false;

    constructor(public key: K, value: V) {
        super(value);
        this.next = this;
        this.prev = this;
    }

    * [Symbol.iterator](): Generator<HeapNode<K, V>> {
        let node: HeapNode<K, V> = this;
        do {
            yield node;
            node = node.next as HeapNode<K, V>;
        } while (node !== this);
    }
}

export type HeapCompareFunc<K> = (a: KeyedObject<K>, b: KeyedObject<K>) => number;
export function DefaultHeapCompare<K>(a: KeyedObject<K>, b: KeyedObject<K>): -1|0|1 {
    if (a.key === b.key) return 0;
    if (a.key < b.key) return -1;
    return 1;
}

export class Heap<K, V> {
    private _minNode: HeapNode<K, V> | null = null;
    private _nodeCount = 0;
    private _compareFunc: HeapCompareFunc<K>;

    constructor(compare?: HeapCompareFunc<K>) {
        this._compareFunc = compare ? compare : DefaultHeapCompare<K>;
    }

    public clear() {
        this._minNode = null;
        this._nodeCount = 0;
    }

    public decreaseKey(node: HeapNode<K, V>, newKey: K): void {
        if (!node) {
            throw new Error('No node passed to decreaseKey');
        }

        if (this._compareFunc({key: newKey}, {key: node.key}) > 0) {
            throw new Error('Key value cannot increase');
        }

        node.key = newKey;
        const parent = node.parent;
        if (parent && this._compareFunc(node, parent) < 0) { // node is now smaller than parent
            this._cut(node, parent, this._minNode!);
            this._cascadingCut(parent, this._minNode!);
        }
        if (this._compareFunc(node, this._minNode!) < 0) {
            this._minNode = node;
        }
    }

    public delete(node: HeapNode<K, V>): void {
        // because of the generic key, we cut this node and then
        // set it to the minNode and pop it
        const parent = node.parent;
        if (parent) {
            this._cut(node, parent, this._minNode!);
            this._cascadingCut(parent, this._minNode!);
        }
        this._minNode = node;
        this.extractMinimum();
    }

    public extractMinimum(): HeapNode<K, V> | null {
        const extracted = this._minNode;
        if (!extracted) {
            return null;
        }

        if (extracted.child) {
            let child = extracted.child;
            do {
                child.parent = null;
                child = child.next as HeapNode<K, V>;
            } while (child !== extracted.child);
        }

        let rootNext: HeapNode<K, V> | null = null;
        if (extracted.next !== extracted) {
            rootNext = extracted.next as HeapNode<K, V>;
        }

        // remove it from the root list
        this._removeFromList(extracted);

        this._nodeCount--;

        this._minNode = this._mergeLists(rootNext, extracted.child);
        if (this._minNode) {
            this._minNode = this._consolidate(this._minNode);
        }

        return extracted
    }

    public findMinimum(): HeapNode<K, V> | null {
        return this._minNode;
    }

    public insert(key: K, value: V): HeapNode<K, V> {
        const node = new HeapNode<K, V>(key, value);
        this._minNode = this._mergeLists(this._minNode, node);
        this._nodeCount++;
        return node;
    }

    public isEmpty(): boolean {
        return this._minNode === null;
    }

    public get size(): number {
        return this._nodeCount;
    }

    public union(other: Heap<K, V>): void {
        this._minNode = this._mergeLists(this._minNode, other._minNode);
        this._nodeCount += other._nodeCount;
    }

    private _cut(node: HeapNode<K, V>, parent: HeapNode<K, V>, minNode: HeapNode<K, V>): HeapNode<K, V> | null {
        node.parent = null;
        parent.degree--;
        if (node.next === node) {
            parent.child = null;
        } else {
            parent.child = node.next as HeapNode<K, V>;
        }

        this._removeFromList(node);
        const newMin = this._mergeLists(minNode, node);
        node.isMarked = false;
        return newMin;
    }

    private _cascadingCut(node: HeapNode<K, V>, minNode: HeapNode<K, V> | null): HeapNode<K, V> | null {
        const parent = node.parent;
        if (parent) {
            if (node.isMarked) {
                minNode = this._cut(node, parent, minNode!);
                minNode = this._cascadingCut(parent, minNode);
            } else {
                node.isMarked = true;
            }
        }
        return minNode;
    }

    private _consolidate(minNode: HeapNode<K, V>): HeapNode<K, V> {
        const aux: (HeapNode<K, V>|null)[] = [];
        for (let current of minNode) {
            let auxCurrent = aux[current.degree];
            while (auxCurrent) {
                if (this._compareFunc(current, auxCurrent) > 0) {
                    const temp = auxCurrent;
                    auxCurrent = current;
                    current = temp;
                }
                this._linkHeaps(auxCurrent, current);
                aux[current.degree] = null;
                current.degree++;
                auxCurrent = aux[current.degree];
            }
            aux[current.degree] = current;
        }

        let newMin: HeapNode<K, V> | null = null;
        for (const node of aux) {
            if (node) {
                node.next = node;
                node.prev = node;
                newMin = this._mergeLists(newMin, node);
            }
        }

        return newMin!;
    }

    private _removeFromList(node: HeapNode<K, V>): void {
        const prev = node.prev!;
        const next = node.next!;
        prev.next = next;
        next.prev = prev;
        node.next = node;
        node.prev = node;
    }

    private _linkHeaps(max: HeapNode<K, V>, min: HeapNode<K, V>): void {
        this._removeFromList(max);
        min.child = this._mergeLists(max, min.child);
        max.parent = min;
        max.isMarked = false;
    }

    private _mergeLists(a: HeapNode<K, V> | null, b: HeapNode<K, V> | null): HeapNode<K, V> | null {
        if (!a) {
            if (!b) {
                return null;
            }
            return b;
        }
        if (!b) {
            return a;
        }

        const temp = a.next!;
        a.next = b.next!;
        a.next.prev = a;
        b.next = temp;
        b.next.prev = b;

        return this._compareFunc(a, b) < 0 ? a : b;
    }
}