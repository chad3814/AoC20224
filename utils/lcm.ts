import { gcd } from "./gcd";
import { memoize } from "./memoize";

export const lcm = (memoize<void, [number, number], number>(2))((a: number, b: number): number => {
    if (a === 0 && b === 0) {
        return 0;
    }
    return a * b / gcd(a, b);
});
