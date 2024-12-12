type Params =readonly unknown[];

export function memoize<T extends Params, R>(
    func: (...args: T) => R
) {
    const map = new Map<string, R>();
    return (...args: T) => {
        const key = args.join(':');
        let ret = map.get(key);
        if (ret) {
            return ret;
        }
        ret = func(...args);
        map.set(key, ret);
        return ret;
    }
}
