import { NotImplemented, Options, run } from "aoc-copilot";
import { permutations } from "../utils/permutations";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /(?<name1>\w+) would (?<gl>(gain)|(lose)) (?<points>\d+) happiness units by sitting next to (?<name2>\w+)/u;
type Person = {
    name: string;
    nextTo: {
        [name: string]: number;
    };
};

function happyScore(people: Person[]): number {
    let total = 0;
    for (let i = 1; i < people.length; i++) {
        total += people[i - 1].nextTo[people[i].name];
        total += people[i].nextTo[people[i - 1].name];
    }
    total += people[0].nextTo[people[people.length  - 1].name];
    total += people[people.length - 1].nextTo[people[0].name];
    return total;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const personMap = new Map<string, Person>();
    for (const line of input) {
        const match = line.match(RE);
        if (!match || !match.groups) {
            throw new Error('RE failure');
        }
        const {name1, gl, points: _p, name2} = match.groups;
        const points = (gl === 'lose' ? -1 : 1) * parseInt(_p, 10);
        const person = personMap.get(name1) ?? {name: name1, nextTo: {}};
        person.nextTo[name2] = points;
        personMap.set(name1, person);
    }
    if (part === 1) {
        return Math.max(...[...permutations([...personMap.values()])].map(p => happyScore(p)));
    }
    throw new NotImplemented('Not Implemented');
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
