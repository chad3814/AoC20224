import { NotImplemented, Options, run } from "aoc-copilot";
import { NumericDefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

function getKey(x: number, y: number) {
    return `${x}:${y}`;
}

const RE = /(?<command>(turn on)|(turn off)|(toggle)) (?<x1>[0-9]+),(?<y1>[0-9]+) through (?<x2>[0-9]+),(?<y2>[0-9]+)/u;

function part1(input: string[]): number {
    const lights = new Set<string>();
    for (const line of input) {
        const match = line.match(RE);
        if (!match) {
            console.log('failed to match', line);
            throw new Error('ugh');
        }
        const x1 = parseInt(match.groups!.x1, 10);
        const y1 = parseInt(match.groups!.y1, 10);
        const x2 = parseInt(match.groups!.x2, 10);
        const y2 = parseInt(match.groups!.y2, 10);
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                const key = getKey(x, y);
                if (match.groups!.command === 'turn on') {
                    lights.add(key);
                }
                if (match.groups!.command === 'turn off') {
                    lights.delete(key);
                }
                if (match.groups!.command === 'toggle') {
                    if (lights.has(key)) {
                        lights.delete(key);
                    } else {
                        lights.add(key);
                    }
                }
            }
        }
    }
    return lights.size;
}

function part2(input: string[]): number {
    const lights = new NumericDefaultMap<string>(0);
    for (const line of input) {
        const match = line.match(RE);
        if (!match) {
            console.log('failed to match', line);
            throw new Error('ugh');
        }
        const x1 = parseInt(match.groups!.x1, 10);
        const y1 = parseInt(match.groups!.y1, 10);
        const x2 = parseInt(match.groups!.x2, 10);
        const y2 = parseInt(match.groups!.y2, 10);
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                const key = getKey(x, y);
                const power = lights.get(key);
                if (match.groups!.command === 'turn on') {
                    lights.set(key, power + 1);
                }
                if (match.groups!.command === 'turn off') {
                    lights.set(key, Math.max(0, power -1));
                }
                if (match.groups!.command === 'toggle') {
                    lights.set(key, power + 2);
                }
            }
        }
    }
    const total = [...lights.values()].reduce(
        (t, l) => t + l
    );
    return total;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        return part1(input);
    }
    return part2(input);
}

const options: Options = {};
const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
