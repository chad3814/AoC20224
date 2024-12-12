import { NotImplemented, run } from "aoc-copilot";
import { take } from "../utils/take";

type AdditionalInfo = {
    [key: string]: string;
};

type Rucksack = [string, string];
const A = 'A'.charCodeAt(0);
const Z = 'Z'.charCodeAt(0);
const a = 'a'.charCodeAt(0);
const z = 'z'.charCodeAt(0);
function getPriority(item: string) {
    const val = item.charCodeAt(0);
    if (val >= a && val <= z) return val - a + 1;
    return val - A + 27;
}

function union<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
    const set = new Set<T>();
    const setA = new Set(a);
    for (const item of b) {
        if (setA.has(item)) {
            set.add(item);
        }
    }
    return set;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const rucksacks: Rucksack[] = []
    for (const line of input) {
        const part1 = line.slice(0, line.length / 2);
        const part2 = line.slice(line.length / 2);
        rucksacks.push([part1, part2]);
    }
    if (part === 1) {
        let total = 0;
        for (const rucksack of rucksacks) {
            const set = union(...rucksack);
            for (const item of set.values()) {
                total += getPriority(item);
            }
        }
        return total;
    }
    let total = 0;
    for (const group of take(3, rucksacks)) {
        const set1 = union(group[0].join(''), group[1].join(''));
        const set = union(set1, group[2].join(''));
        if (set.size !== 1) {
            throw new Error('not one ' + set.size);
        }
        total += getPriority([...set.values()][0]);
    }
    return total;
}

run(__filename, solve);
