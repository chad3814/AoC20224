export function factorize(n: number) {
    const factors: number[] = [];
    if (n <= 1) return factors;
    while (n % 2 === 0) { // Even optimization
        factors.push(2);
        n /= 2;
    }
    for (let i = 3; i <= Math.sqrt(n); i += 2) { // Odd optimization
        while (n % i === 0) {
            factors.push(i);
            n /= i;
        }
    }
    if (n > 1) factors.push(n); // Prime optimization
    return factors;
}

function _gcd(a: number, b: number): number {
    return b > 0 ? _gcd(b, a % b) : a;
}

export function gcd(numbers: number[]): number {
    let a = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        a = _gcd(a, numbers[i]);
    }
    return a;
}

function _lcm(a: number, b: number): number {
    return a * b / _gcd(a, b);
}

export function lcm(numbers: number[]): number {
    let a = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        a = _lcm(a, numbers[i]);
    }
    return a;
}

// Reduce a fraction
export function fractionReduce(numerator: number, denominator: number) {
    const divisor = _gcd(numerator, denominator);
    return { numerator: numerator / divisor, denominator: denominator / divisor };
}
