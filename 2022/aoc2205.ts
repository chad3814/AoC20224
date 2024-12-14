import { NotImplemented, run } from "aoc-copilot";
import { take } from "../utils/take";

type AdditionalInfo = {
    [key: string]: string;
};

type Instruction = {
    num: number;
    from: number;
    to: number;
};

const RE = /^move (?<num>\d+) from (?<from>\d+) to (?<to>\d+)$/u;

function dumpStacks(stacks: string[][]) {
    const tallestHeight = Math.max(...stacks.map(stack => stack.length));
    for (let level = tallestHeight - 1; level >= 0; level --) {
        let line: string[] = [];
        for (const stack of stacks) {
            if (stack.length > level) {
                line.push(`[${stack[level]}]`);
            } else {
                line.push('   ');
            }
        }
        console.log(line.join(' '));
    }
    console.log(' 1   2   3   4   5   6   7   8   9');
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const stacks: string[][] = new Array(9);
    const instructions: Instruction[] = [];
    for (let i = 0; i < 9; i++) {
        stacks[i] = [];
    }
    let inStacks = true;
    for (const line of input) {
        if (line.startsWith(' 1')) {
            inStacks = false;
            continue;
        }
        if (line === '') continue;

        if (inStacks) {
            let stack = -1;
            for (const part of take(4, line)) {
                stack++;
                if (part[0] === ' ') {
                    continue;
                }
                stacks[stack].unshift(part[1]);
            }
            continue;
        }

        const matches = line.match(RE);
        if (!matches || !matches.groups) {
            throw new Error('bad RE');
        }
        const {num, from, to} = matches.groups;
        instructions.push({
            num: parseInt(num, 10),
            from: parseInt(from, 10),
            to: parseInt(to, 10),
        });
    }
    if (part === 1) {
        // dumpStacks(stacks);
        for (const instruction of instructions) {
            // console.log(instruction);
            for (let i = 0; i < instruction.num; i++) {
                const crate = stacks[instruction.from - 1].pop();
                if (!crate) {
                    throw new Error('bad instruction');
                }
                stacks[instruction.to - 1].push(crate);
                // dumpStacks(stacks);
            }
        }
        dumpStacks(stacks);
        return stacks.map(stack => stack.pop()).join('');
    }
    dumpStacks(stacks);
    for (const instruction of instructions) {
        const temp: string[] = [];
        for (let i = 0; i < instruction.num; i++) {
            const crate = stacks[instruction.from - 1].pop();
            if (!crate) {
                throw new Error('bad instruction');
            }
            temp.push(crate);
        }
        for (let i = 0; i < instruction.num; i++) {
            const crate = temp.pop();
            if (!crate) {
                throw new Error('bad instruction');
            }
            stacks[instruction.to - 1].push(crate);
        }
    }
    dumpStacks(stacks);
    return stacks.map(stack => stack.pop()).join('');
}

run(__filename, solve);
