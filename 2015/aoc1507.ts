import { NotImplemented, Options, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

interface Component {
    get value(): number;
    get active(): boolean;
    toString(): string;
    get type(): string;
    visited: boolean;
    sources: Component[];
    reset(): void;
}

class Signal implements Component {
    get value() { return this._value & 0xFFFF; };
    get active() { return true; };
    toString(): string {
        return this._value.toString(10);
    }
    get type() { return `Signal ${this._value}`; }
    visited = false;
    sources: Component[] = [];
    constructor(private _value: number) {}
    reset() { }
}

class Wire implements Component {
    get value() {
        if (this.cached == undefined) {
            if (this._source) {
                this.cached = this._source.value;
            } else {
                throw new Error(`Wire ${this.name} has an undefined source`);
            }
        }
        // console.log(this.name, this.cached);
        return this.cached;
    }
    get active() { return this._source?.active ?? false; };
    set source(s: Component) { this._source = s; this.sources = [s]; };
    toString(): string {
        return `${this._source?.type} ${this.name}`;
    }
    get type() { return `(Wire ${this.name})`; }
    visited = false;
    sources: Component[] = [];
    constructor(private name: string, private _source?: Component) {
        if (_source) {
        this.sources = [_source];
        }
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

class And implements Component {
    get value() {
        if (this.cached == undefined) {
            this.cached = (this.source1.value & this.source2.value) & 0xFFFF;
        }
        return this.cached;
    }
    get active() { return this.source1.active && this.source2.active; };
    toString(): string {
        return `${this.source1.toString()} & ${this.source2.toString()}`;
    }
    get type() { return `${this.source1.type} And ${this.source2.type}`; }
    visited = false;
    sources: Component[];
    constructor(private source1: Component, private source2: Component) {
        this.sources = [source1, source2];
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

class Or implements Component {
    get value() {
        if (this.cached == undefined) {
            this.cached = (this.source1.value | this.source2.value) & 0xFFFF;
        }
        return this.cached;
    }

    get active() { return this.source1.active && this.source2.active; };
    toString(): string {
        return `${this.source1.toString()} | ${this.source2.toString()}`;
    }
    get type() { return `${this.source1.type} Or ${this.source2.type}`; }
    visited = false;
    sources: Component[];
    constructor(private source1: Component, private source2: Component) {
        this.sources = [source1, source2];
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

class LShift implements Component {
    get value() {
        if (this.cached == undefined) {
            this.cached = (this.source.value << this.shift) & 0xFFFF;
        }
        return this.cached;
    }
    get active() { return this.source.active; };
    toString(): string {
        return `${this.source.toString()} << ${this.shift}`;
    }
    get type() { return `${this.source.type} LShift ${this.shift}`; }
    visited = false;
    sources: Component[];
    constructor(private source: Component, private shift: number) {
        this.sources = [source];
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

class RShift implements Component {
    get value() {
        if (this.cached == undefined) {
            this.cached = (this.source.value >> this.shift) & 0xFFFF;
        }
        return this.cached;
    }
    get active() { return this.source.active; };
    toString(): string {
        return `${this.source.toString()} >> ${this.shift}`;
    }
    get type() { return `${this.source.type} RShift ${this.shift}`; }
    visited = false;
    sources: Component[];
    constructor(private source: Component, private shift: number) {
        this.sources = [source];
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

class Not implements Component {
    get value() {
        if (this.cached == undefined) {
            this.cached = (~(this.source.value & 0xFFFF)) & 0xFFFF;
        }
        return this.cached;
    }
    get active() { return this.source.active; };
    toString(): string {
        return `~${this.source.toString()}`;
    }
    get type() { return `Not ${this.source.type}`; }
    visited = false;
    sources: Component[];
    constructor(private source: Component) {
        this.sources = [source];
    }
    private cached: number | undefined;
    reset() { this.cached = undefined; }
}

const OUTPUT_RE = / -> (?<output>[a-z]+)$/u;
const WIRE_RE = /^(?<input>[0-9a-z]+) ->/u;
const NOT_RE = /^NOT (?<input>[0-9a-z]+) -> (?<output>[a-z]+)$/u;
const BINARY_RE = /^(?<input1>[0-9a-z]+) (?<operator>(AND)|(OR)|(LSHIFT)|(RSHIFT)) (?<input2>[0-9a-z]+) -> (?<output>[a-z]+)$/u;
const NUMS = /^[0-9]+$/u;

function part1(input: string[]): number {
    const wires = new Map<string, Wire>();
    for (const line of input) {
        let match = line.match(OUTPUT_RE);
        if (!match) {
            throw new Error('Output match failed ' + line);
        }
        const wire = wires.get(match.groups!.output) ?? new Wire(match.groups!.output);
        wires.set(match.groups!.output, wire);

        if (match = line.match(WIRE_RE)) {
            const inputStr = match.groups!.input;
            let input;
            if (inputStr.match(NUMS)) {
                // console.log('wire match', inputStr, 'signal');
                input = new Signal(parseInt(inputStr, 10));
            } else {
                // console.log('wire match', inputStr, 'wire');
                input = wires.get(inputStr) ?? new Wire(inputStr);
                wires.set(inputStr, input);
            }
            wire.source = input;
        } else if (match = line.match(NOT_RE)) {
            const inputStr = match.groups!.input;
            let input;
            if (inputStr.match(NUMS)) {
                input = new Signal(parseInt(inputStr, 10));
            } else {
                input = wires.get(inputStr) ?? new Wire(inputStr);
                wires.set(inputStr, input);
            }
            const not = new Not(input);
            wire.source = not;
        } else if (match = line.match(BINARY_RE)) {
            let input1, input2;
            const input1Str = match.groups!.input1;
            const input2Str = match.groups!.input2;

            if (input1Str.match(NUMS)) {
                input1 = new Signal(parseInt(input1Str, 10));
            } else {
                input1 = wires.get(input1Str) ?? new Wire(input1Str);
                wires.set(input1Str, input1);
            }

            if (input2Str.match(NUMS)) {
                input2 = new Signal(parseInt(input2Str, 10));
            } else {
                input2 = wires.get(input2Str) ?? new Wire(input2Str);
                wires.set(input2Str, input2);
            }

            let comp;
            switch (match.groups!.operator) {
                case 'AND':
                    comp = new And(input1, input2);
                    break;
                case 'OR':
                    comp = new Or(input1, input2);
                    break;
                case 'LSHIFT':
                    comp = new LShift(input1, input2.value);
                    break;
                case 'RSHIFT':
                    comp = new RShift(input1, input2.value);
                    break;
                default:
                    throw new Error('Unknown operator: ' + match.groups!.operator + ' in line ' + line);
            }
            wire.source = comp;
        } else {
            throw new Error('Line did not match any RE ' + line);
        }
    }
    const a = wires.get('a')!;
    return a.value;
}


function part2(input: string[]): number {
    const wires = new Map<string, Wire>();
    for (const line of input) {
        let match = line.match(OUTPUT_RE);
        if (!match) {
            throw new Error('Output match failed ' + line);
        }
        const wire = wires.get(match.groups!.output) ?? new Wire(match.groups!.output);
        wires.set(match.groups!.output, wire);

        if (match = line.match(WIRE_RE)) {
            const inputStr = match.groups!.input;
            let input;
            if (inputStr.match(NUMS)) {
                // console.log('wire match', inputStr, 'signal');
                input = new Signal(parseInt(inputStr, 10));
            } else {
                // console.log('wire match', inputStr, 'wire');
                input = wires.get(inputStr) ?? new Wire(inputStr);
                wires.set(inputStr, input);
            }
            wire.source = input;
        } else if (match = line.match(NOT_RE)) {
            const inputStr = match.groups!.input;
            let input;
            if (inputStr.match(NUMS)) {
                input = new Signal(parseInt(inputStr, 10));
            } else {
                input = wires.get(inputStr) ?? new Wire(inputStr);
                wires.set(inputStr, input);
            }
            const not = new Not(input);
            wire.source = not;
        } else if (match = line.match(BINARY_RE)) {
            let input1, input2;
            const input1Str = match.groups!.input1;
            const input2Str = match.groups!.input2;

            if (input1Str.match(NUMS)) {
                input1 = new Signal(parseInt(input1Str, 10));
            } else {
                input1 = wires.get(input1Str) ?? new Wire(input1Str);
                wires.set(input1Str, input1);
            }

            if (input2Str.match(NUMS)) {
                input2 = new Signal(parseInt(input2Str, 10));
            } else {
                input2 = wires.get(input2Str) ?? new Wire(input2Str);
                wires.set(input2Str, input2);
            }

            let comp;
            switch (match.groups!.operator) {
                case 'AND':
                    comp = new And(input1, input2);
                    break;
                case 'OR':
                    comp = new Or(input1, input2);
                    break;
                case 'LSHIFT':
                    comp = new LShift(input1, input2.value);
                    break;
                case 'RSHIFT':
                    comp = new RShift(input1, input2.value);
                    break;
                default:
                    throw new Error('Unknown operator: ' + match.groups!.operator + ' in line ' + line);
            }
            wire.source = comp;
        } else {
            throw new Error('Line did not match any RE ' + line);
        }
    }
    const a = wires.get('a')!;
    const value = a.value;
    const b = wires.get('b');
    b!.source = new Signal(value);
    const toVisit: Component[] = [...wires.values()];
    while(toVisit.length > 0) {
         const node = toVisit.shift()!;
         if (node.visited) {
            continue;
         }
         node.visited = true;
         node.reset();
         toVisit.push(...node.sources);
    }
    return a.value;
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
