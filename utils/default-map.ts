export class DefaultMap<K, V> extends Map<K, V> {
    constructor(public readonly defaultValue: V, entries?: Iterable<[K, V]>) {
        super(entries);
    }
    get(key: K) {
        return this.has(key) ? super.get(key)! : this.defaultValue;
    }
}

export class NumericDefaultMap<K> extends DefaultMap<K, number> {
    constructor(public readonly defaultValue: number, entries?: Iterable<[K, number]>) {
        super(defaultValue, entries);
    }

    increment(key: K) {
        this.set(key, this.get(key) + 1);
    }

    decrement(key: K) {
        this.set(key, this.get(key) - 1);
    }
}