import { NotImplemented, run } from "aoc-copilot";
import { take } from "../utils/take";

type AdditionalInfo = {
    [key: string]: string;
};

type threeBit = 0|1|2|3|4|5|6|7;
type Registers = {
    A: bigint;
    B: bigint;
    C: bigint;
    IP: number;
    output: threeBit[];
};
const register: Registers = {
    A: 0n,
    B: 0n,
    C: 0n,
    IP: 0, // instruction pointer
    output: [],
};

const comboOperand = Object.freeze([
    ()=>0n, ()=>1n, ()=>2n, ()=>3n,
    ()=>register.A,
    ()=>register.B,
    ()=>register.C,
]);

const opCode = Object.freeze([
    (operand: threeBit) => register.A = register.A / BigInt(2n**comboOperand[operand]()), // adv
    (operand: threeBit) => register.B = register.B ^ BigInt(operand), // bxl
    (operand: threeBit) => register.B = comboOperand[operand]() % 8n, //bst
    (operand: threeBit) => register.IP = (register.A === 0n) ? register.IP : operand, // jnz
    (                 ) => register.B = register.B ^ register.C, // bxc
    (operand: threeBit) => register.output.push(parseInt((comboOperand[operand]() % 8n).toString(10), 10) as threeBit), // out
    (operand: threeBit) => register.B = register.A / (2n**comboOperand[operand]()), // bdv
    (operand: threeBit) => register.C = register.A / (2n**comboOperand[operand]()), // cdv
])

const REG_RE = /^Register (?<register>[ABC]): (?<value>\d+)$/u;
const PROG_RE = /^Program: (?<program>[0-7](,[0-7])*)$/u;

const codes = [
    'adv',
    'bxl',
    'bst',
    'jnz',
    'bxc',
    'out',
    'bdv',
    'cdv',
];
const english = [
    'a store a / 2^combo',
    'b xor literal',
    'b store combo % 8',
    'jump to literal if a !0',
    'b xor c operand ignored',
    'output combo % 8',
    'c store a / 2^combo',
    'c store a / 2^combo'
];
const combo = ['0', '1', '2', '3', 'A',' B', 'C'];

function dumpProgram(program: threeBit[]) {
    for (let ip = 0; ip < program.length - 1; ip+=2) {
        const op = program[ip];
        const operand = program[ip + 1];
        console.log(codes[op], operand, ';', english[op], `(combo = ${combo[operand]})`);
    }
}

function equal(program: threeBit[], output: threeBit[]): boolean {
    let i = 0;
    if (program.length !== output.length) return false;
    while(i < program.length && program[i] === output[i]) i++;
    if (i === program.length) return true;
    return false;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number | bigint> {
    register.IP = 0;
    register.output.length = 0;
    const program: threeBit[] = [];
    for (const line of input) {
        if (line === '') continue;
        let matches = line.match(REG_RE);
        if (matches && matches.groups) {
            if (matches.groups.register) {
                register[matches.groups.register as 'A'|'B'|'C'] = BigInt(matches.groups.value);
            } else {
                throw new Error('bad reg re');
            }
            continue;
        }
        matches = line.match(PROG_RE);
        if (matches && matches.groups) {
            if (matches.groups.program) {
                program.push(...matches.groups.program.split(',').map(x => parseInt(x, 10) as threeBit));
            }
        } else {
            console.log(`line: "${line}"`);
            throw new Error('bad prog re');
        }
    }

    if (part === 1) {
        if (test) {
            console.log('registers:', register);
            console.log('program:', program);
            dumpProgram(program);
            console.log();
            console.log();
        }
        while (register.IP < program.length - 1) {
            const op = program[register.IP] as threeBit;
            const operand = program[register.IP + 1] as threeBit;
            register.IP += 2;
            opCode[op](operand);
        }
        return register.output.join(',');
    }
    let startA: bigint = 0n;
    const startB = register.B;
    const startC = register.C;
    startA = 0n;
    console.log(`${' '.padStart(20)} [ ${program.join(', ')} ]`);
    while (!equal(program, register.output)) {
        startA++;
        register.A = startA;
        register.B = startB;
        register.C = startC;
        register.IP = 0;
        register.output.length = 0;

        while (register.IP < program.length - 1) {
            const op = program[register.IP] as threeBit;
            const operand = program[register.IP + 1] as threeBit;
            register.IP += 2;
            opCode[op](operand);
        }
        if (register.output.length < program.length) {
            let allMatched = true;
            for (let i = 0; i < register.output.length; i++) {
                allMatched = allMatched && register.output[register.output.length - i - 1] === program[program.length - i - 1];
            }
            if (allMatched) {
                startA = startA * 8n - 1n;
                console.log(`${startA.toString().padStart(20)} [ ${register.output.join(', ').padStart(program.length * 3 - 2)} ]`);
            }
        }
    }
    console.log(`${startA.toString().padStart(20)} [ ${register.output.join(', ').padStart(program.length * 3 - 2)} ]`);
    return startA;
}

type AocCopilotOptions = {
    testsOnly?: boolean;
    skipTests?: boolean;
    onlyPart?: 1|2;
};
const options: AocCopilotOptions = {}

const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options, {
    reason: 'Multiple examples',
    part1length: 1,
    inputs: {
        selector: 'code',
        indexes: [92,99],
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [95,101],
    }
});
