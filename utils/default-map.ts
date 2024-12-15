export class DefaultMap<K, V> extends Map<K, V> {
    constructor(public readonly defaultValue: V, entries?: Iterable<[any, any]>) {
        super(entries);
    }
    get(key: K) {
        return this.has(key) ? super.get(key)! : this.defaultValue;
    }
}
