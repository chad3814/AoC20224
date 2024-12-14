import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Cleaner = [number, number];
type Pair = [Cleaner, Cleaner];

function completeOverlap(a: Cleaner, b: Cleaner): boolean {
    if (a[0] >= b[0] && a[1] <= b[1]) {
        return true;
    }
    if (b[0] >= a[0] && b[1] <= a[1]) {
        return true;
    }
    return false;
}

function anyOverlap(a: Cleaner, b: Cleaner): boolean {
    if (a[0] >= b[0] && a[0] <= b[1]) {
        return true;
    }
    if (a[1] >= b[0] && a[1] <= b[1]) {
        return true;
    }
    if (b[0] >= a[0] && b[0] <= a[1]) {
        return true;
    }
    if (b[1] >= a[0] && b[1] <= a[1]) {
        return true;
    }
    return false;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const pairs: Pair[] = [];
    for (const line of input) {
        const [a, b] = line.split(',');
        const cleanerA: Cleaner = a.split('-').map(Number) as [number, number];
        const cleanerB: Cleaner = b.split('-').map(Number) as [number, number];
        pairs.push([cleanerA, cleanerB]);
    }
    if (part === 1) {
        return pairs.map(
            pair => completeOverlap(pair[0], pair[1])
        ).reduce((a, b) => a + (b?1:0), 0)
    }
    return pairs.map(
        pair => anyOverlap(pair[0], pair[1])
    ).reduce((a, b) => a + (b?1:0), 0)
}

run(__filename, solve);
