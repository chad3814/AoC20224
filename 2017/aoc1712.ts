import { logger, NotImplemented, run } from "aoc-copilot";
import { count } from "console";
import { memoize } from "../utils/memoize";
import { connected } from "process";

type AdditionalInfo = {
    [key: string]: string;
};

class Program {
    public connections = new Set<Program>();

    constructor(public readonly name: string) {}
}

const RE = /(?<name>\d+) <-> (?<connections>.*)/u;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const allPrograms = new Map<string, Program>();
    for (const line of input) {
        const matches = line.match(RE);
        if (!matches || !matches.groups) {
            throw new Error('RE problem');
        }
        const name = matches.groups.name;
        const program = allPrograms.get(name) ?? new Program(name);
        allPrograms.set(name, program);
        const connections = matches.groups.connections;
        for (const connection of connections.split(', ')) {
            const c = allPrograms.get(connection) ?? new Program(connection);
            allPrograms.set(connection, c);
            program.connections.add(c);
            c.connections.add(program);
        }
    }
    if (part === 1) {
        let program = allPrograms.get('0');
        const connected = new Set<Program>();
        const queue = [program];
        while (queue.length > 0) {
            program = queue.shift()!;
            connected.add(program);
            // console.log('added', program.name, program.connections.size);
            for (const c of program.connections.values()) {
                if (!connected.has(c)) {
                    // console.log('queued', c.name);
                    queue.push(c);
                // } else {
                //     console.log("didn't queue", c.name);
                }
            }
        }
        return connected.size
    }
    let count = 0;
    while (allPrograms.size > 0) {
        count++;
        let program: Program = [...allPrograms.values()][0];
        const group = new Set<Program>();
        const queue = [program];
        while (queue.length > 0) {
            program = queue.shift()!;
            group.add(program);
            for (const c of program.connections.values()) {
                if (!group.has(c)) {
                    queue.push(c);
                }
            }
        }
        for (const p of group.values()) {
            allPrograms.delete(p.name);
        }
    }
    return count;
}

run(__filename, solve);
