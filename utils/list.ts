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

export function* llListNode<T>(list: LinkedList<T>): Generator<Node<T>> {
    let node = list.head;
    while (node !== null) {
        yield node;
        node = node.next;
    }
}

export function* llList<T>(list: LinkedList<T>): Generator<T> {
    for (const node of llListNode(list)) {
        yield node.value;
    }
}
