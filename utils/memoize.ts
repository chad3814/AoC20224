type Params =readonly unknown[];

export interface Memoable {
    toMemo(): string;
}
const isMemoable = (value: Memoable): value is Memoable => typeof value.toMemo === 'function';

function key(x: any): string {
    const s = String(x);
    if (typeof x !== 'object') return s;
    if (Array.isArray(x)) return '[' + x.map(key).join(',') + ']';
    if (isMemoable(x)) return x.toMemo();
    if (!s.startsWith('[object ')) return s;
    let entries = Object.entries(x);
    if (x.entries) {
        entries = x.entries();
    }
    return '{' + [...entries].map(key).join(';') + '}';
}

export function memoize<This, T extends Params, R>(
    numArg = Number.POSITIVE_INFINITY
): (func: (...args: T)=>R) => (this: This, ...args: T) => R {
    return (func: (...args: T) => R) => {
        const map = new Map<string, R>();
        return function(this: This, ...args: T) {
            const k = key(args.slice(0, numArg));
            let ret = map.get(k);
            if (ret) {
                return ret;
            }
            ret = func.call(this, ...args);
            map.set(k, ret);
            return ret;
        }
    }
}
