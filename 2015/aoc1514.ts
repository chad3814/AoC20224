import { AdditionalInfo, NotImplemented, Options, run } from "aoc-copilot";

// Vixen can fly 8 km/s for 8 seconds, but then must rest for 53 seconds
const RE = /(?<name>\w+) can fly (?<rate>\d+) km\/s for (?<fly>\d+) .*? rest for (?<rest>\d+)/u;

type Reindeer = {
    name: string;
    rate: number;
    fly: number;
    rest: number;
    distance: number;
    score: number;
    isFlying: boolean;
    countDown: number;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const reindeer: Reindeer[] = input.filter(i => i !== '').map(
        line => {
            const match = line.match(RE);
            if (!match || !match.groups) {
                throw new Error('RE failed ' + line);
            }
            const name = match.groups.name;
            const rate = parseInt(match.groups.rate, 10);
            const fly = parseInt(match.groups.fly, 10);
            const rest = parseInt(match.groups.rest, 10);
            return {name, rate, fly, rest, distance: 0, score: 0, isFlying: true, countDown: fly};
        }
    );
    const time = test ? 1000 : 2503;
    if (part === 1) {
        return Math.max(...reindeer.map(
            deer => {
                const deerTime = deer.fly + deer.rest;
                const count = Math.floor(time / deerTime);
                const dist = count * deer.rate * deer.fly;
                return dist + Math.min(deer.fly, time % deerTime) * deer.rate;
            }
        ));
    }
    for (let t = 0; t < time; t++) {
        for (const deer of reindeer) {
            deer.countDown--;
            if (deer.isFlying) deer.distance += deer.rate;
            if (deer.countDown === 0) {
                deer.countDown = deer.isFlying ? deer.rest : deer.fly;
                deer.isFlying = !deer.isFlying;
            }
        }
        const max = Math.max(...reindeer.map(d => d.distance));
        for (const deer of reindeer) {
            if (deer.distance === max) deer.score++;
        }
    }
    return Math.max(...reindeer.map(d => d.score));
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
