import { memoize } from "./memoize";

const memo = memoize<void, [number, number], number>(2);
export const gcd = memo((a: number, b: number): number => {
    if (b > a) {
        return gcd(b, a);
    }
    if (a === b || b === 0) {
        return a;
    }
    return gcd(b, a % b);
});

export type ExtendedGcd = {
    gcd: number;
    bezoutA: number;
    bezoutB: number;
    quotientA: number;
    quotientB: number;
};

const memo2 = memoize<void, [number, number], ExtendedGcd>(2);
export const extendedGcd = memo2((a: number, b: number): ExtendedGcd => {
    let [oldR, r] = [a, b];
    let [oldS, s] = [1, 0];
    let [oldT, t] = [0, 1];
    let q: number;
    while (r !== 0) {
        q = Math.floor(oldR / r);
        [oldR, r] = [r, oldR - q * r];
        [oldS, s] = [s, oldS - q * s];
        [oldT, t] = [t, oldT - q * t];
    }
    return {
        gcd: oldR,
        bezoutA: oldS,
        bezoutB: oldT,
        quotientA: t,
        quotientB: s,
    }
});


