export class EmptyListError extends Error {}
export class WrongListError extends Error {}

export class Node<T> {
    constructor(public value: T, public readonly linkedList: LinkedList<T>) {
        this.next = null;
        this.prev = null;
        this.visited = false;
    }
    public next: Node<T> | null;
    public prev: Node<T> | null;
    public visited: boolean;
};

export class LinkedList<T> {
    public head: Node<T> | null = null;
    public tail: Node<T> | null = null;
    public get length() { return this._length; }

    constructor(nodesOrValues?: Iterable<Node<T>|T>) {
        if (nodesOrValues) {
            for (const node of nodesOrValues) {
                if (node instanceof Node) {
                    this.append(node.value);
                } else {
                    this.append(node);
                }
            }
        }
    }

    append(value: T): Node<T> {
        const node = new Node<T>(value, this);
        this.appendNode(node);
        return node;
    }

    appendNode(node: Node<T>) {
        if (this.tail) {
            this.tail.next = node;
        } else {
            this.head = node;
        }
        node.prev =this.tail;
        node.next = null;
        this.tail = node;
        this._length++;
    }

    prepend(value: T): Node<T> {
        const node = new Node<T>(value, this);
        this.prependNode(node);
        return node;
    }

    prependNode(node: Node<T>) {
        if (this.head) {
            this.head.prev = node;
        }
        if (!this.tail) {
            this.tail = node;
        }
        node.next = this.head;
        this.head = node;
        this._length++;
        return node;
    }

    insertBefore(target: Node<T>, value: T): Node<T> {
        const node = new Node(value, this);
        this.insertNodeBefore(target, node);
        return node;
    }

    insertNodeBefore(target: Node<T>, node: Node<T>) {
        if (target.prev) {
            target.prev.next = node;
        } else {
            this.head = node;
        }
        node.prev = target.prev;
        node.next = target;
        target.prev = node;
        this._length++;
    }

    insertAfter(target: Node<T>, value: T): Node<T> {
        const node = new Node(value, this);
        return node;
    }

    insertNodeAfter(target: Node<T>, node: Node<T>) {
        if (target.next) {
            target.next.prev = node;
        } else {
            this.tail = node;
        }
        node.next = target.next;
        node.prev = target;
        target.next = node;
        this._length++;
    }

    reset() {
        for (const node of this) {
            node.visited = false;
        }
    }

    * [Symbol.iterator](): Generator<Node<T>> {
        let node = this.head;
        let last = node;
        while(node !== null) {
            yield node;
            last = node;
            node = node.next;
        }
        if (last !== this.tail) {
            throw new Error('iterator missed tail');
        }
    }

    * values(): Generator<T> {
        for (const node of this) {
            yield node.value;
        }
    }

    each(predicate: (node: Node<T>) => void) {
        for (const node of this) {
            predicate(node);
        }
    }

    dup(): LinkedList<T> {
        const list = new LinkedList<T>();
        for (const node of this) {
            list.append(node.value);
        }
        return list;
    }

    shift(): Node<T> {
        const node = this.head;
        if (!node) {
            throw new EmptyListError();
        }

        if (node.next) {
            node.next.prev = null;
        }

        this.head = node.next;
        this._length--;
        return node;
    }

    pop(): Node<T> {
        const node = this.tail;
        if (!node) {
            throw new EmptyListError();
        }

        if (node.prev) {
            node.prev.next = null;
        }

        this.tail = node.prev;
        this._length--;
        return node;
    }

    remove(node: Node<T>): number {
        if (node.linkedList !== this) {
            throw new WrongListError();
        }

        if (node.prev) {
            node.prev.next = node.next;
        }
        if (node.next) {
            node.next.prev = node.prev;
        }
        this._length--;
        if (this.head === node) {
            this.head = node.next;
        }
        if (this.tail === node) {
            this.tail = node.prev;
        }
        return this.length;
    }

    sort(predicate: (a: Node<T>, b: Node<T>) => number): LinkedList<T> {
        if (this.length <= 1) {
            return new LinkedList<T>();
        }

        let left = new LinkedList<T>();
        let right = new LinkedList<T>();
        for (let i = 0; i < this.length; i++) {
            if (i < this._length / 2) {
                left.append(this.shift().value);
            } else {
                right.append(this.shift().value);
            }
        }
        left = left.sort(predicate);
        right = right.sort(predicate);
        const merged = merge(left, right, predicate);
        for (const node of merged) {
            this.append(node.value);
        }
        return this;
    }

    appendList(list: LinkedList<T>) {
        for (const node of list) {
            this.append(node.value);
        }
    }

    mergeList(list: LinkedList<T>) {
        if (!this.tail) {
            this.head = list.head;
            this.tail = list.tail;
            this._length = list._length;
        } else {
            this.tail.next = list.head;
            if (list.head) {
                list.head.prev = this.tail;
                this.tail = list.tail;
            }
            this._length += list._length;
        }
        list.head = this.head;
        list.tail = this.tail;
        list._length = this._length;
    }

    findValue(item: T): Node<T>|null {
        for (const node of this) {
            if (node.value === item) return node;
        }
        return null;
    }

    find(predicate: (node: Node<T>) => boolean): Node<T>|null {
        for (const node of this) {
            if (predicate(node)) {
                return node;
            }
        }
        return null;
    }

    toString(separator = ','): string {
        let str = '';
        let first = true;
        for (const node of this) {
            if (!first) {
                str += separator;
            }
            first = false;
            str += node.value;
        }

        return str;
    }

    private _length = 0;
}

function merge<T>(a: LinkedList<T>, b: LinkedList<T>, predicate: (a: Node<T>, b: Node<T>) => number): LinkedList<T> {
    const list = new LinkedList<T>();

    while (a.length > 0 && b.length > 0) {
        if (predicate(a.head!, b.head!) < 0) {
            list.append(a.shift().value);
        } else {
            list.append(b.shift().value);
        }
    }
    while (a.length > 0) {
        list.append(a.shift().value);
    }
    while (b.length > 0) {
        list.append(b.shift().value);
    }
    return list;
}
