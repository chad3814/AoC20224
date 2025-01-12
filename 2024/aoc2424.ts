import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

abstract class Gate {
    get a() { return this._a; }
    get b() { return this._b; }
    constructor(a: Wire, b: Wire) {
        this._a = a;
        this._b = b;
        a.output.push(this);
        b.output.push(this);
    }

    abstract get value(): boolean | null;
    protected _a: Wire;
    protected _b: Wire;
}

class AND extends Gate {
    get value() {
        if (this._a.value === null || this._b.value === null) return null;
        return this._a.value && this._b.value;
    }
}

class OR extends Gate {
    get value() {
        if (this._a.value === null || this._b.value === null) return null;
        return this._a.value || this._b.value;
    }
}

class XOR extends Gate {
    get value() {
        if (this._a.value === null || this._b.value === null) return null;
        return (this._a.value && !this._b.value) || (!this._a.value && this._b.value);
    }
}

type Wire = {
    name: string;
    value: boolean | null;
    input?: Gate | boolean;
    output: Gate[];
}

const wireToValue = (acc: bigint, wire: Wire) => {
    acc <<= 1n;
    acc += wire.value ? 1n : 0n;
    return acc;
};

const wireRE = /^(?<name>[a-zA-Z0-9]{3}): (?<value>[01])$/u;
const gateRE = /^(?<a>[a-zA-Z0-9]{3}) (?<type>(AND)|(OR)|(XOR)) (?<b>[a-zA-Z0-9]{3}) -> (?<out>[a-zA-Z0-9]{3})$/u;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number | bigint> {
    const wires = new Map<string, Wire>();
    const gates: Gate[] = [];
    const wiresByGate = new Map<Gate, Wire>();

    for (const line of input) {
        let match = line.match(wireRE);
        if (match && match.groups) {
            wires.set(match.groups.name, {
                name: match.groups.name,
                value: match.groups.value === '1',
                input: match.groups.value === '1',
                output: [],
            });
            continue;
        }
        match = line.match(gateRE);
        if (match && match.groups) {
            let gate: Gate;
            const a = wires.get(match.groups.a) ?? {
                name: match.groups.a,
                value: null,
                output: [],
            };
            wires.set(match.groups.a, a);
            const b = wires.get(match.groups.b) ?? {
                name: match.groups.b,
                value: null,
                output: [],
            };
            wires.set(match.groups.b, b);

            if (match.groups.type === 'AND') {
                gate = new AND(a, b);
            } else if (match.groups.type === 'OR') {
                gate = new OR(a, b);
            } else {
                gate = new XOR(a, b);
            }
            const out = wires.get(match.groups.out) ?? {
                name: match.groups.out,
                value: null,
                output: [],
            };
            out.input = gate;
            wires.set(match.groups.out, out);
            gates.push(gate);
            wiresByGate.set(gate, out);
        }
    }
    const xs: Wire[] = new Array<Wire>(44);
    const ys: Wire[] = new Array<Wire>(44);
    const zs: Wire[] = new Array<Wire>(45);
    for (const [label, wire] of wires.entries()) {
        if (label[0] == 'x') {
            const num = Number(label.substring(1));
            xs[num] = wire;
        }
        if (label[0] == 'y') {
            const num = Number(label.substring(1));
            ys[num] = wire;
        }
        if (label[0] == 'z') {
            const num = Number(label.substring(1));
            zs[num] = wire;
        }
    }
    while (zs.some(
        w => w.value === null
    )) {
        for (const wire of wires.values()) {
            if (wire.value === null) {
                if (typeof wire.input === 'boolean') {
                    wire.value = wire.input;
                } else if (wire.input instanceof Gate && wire.input.value !== null) {
                    wire.value = wire.input.value;
                }
            }
        }
    }


    if (part === 1) {
        const zWireLabels = [...wires.keys()].filter(n => n[0] === 'z').sort();
        for (const z of zWireLabels) {
            console.log(`${z}: ${wires.get(z)?.value}`);
        }
        return [...wires.keys()].filter(n => n[0] === 'z').reduce(
            (total: bigint, name: string) => {
                const wire = wires.get(name)!;
                if (!wire.value) return total;
                const bit = BigInt(name.substring(1));
                return total + (1n << bit);
            }, 0n);
    }

    // part 2
    const wrongGates = new Set<string>();

    const xVal = xs.reverse().reduce(wireToValue, 0n);
    const yVal = ys.reverse().reduce(wireToValue, 0n);
    const zVal = zs.reverse().reduce(wireToValue, 0n);
    console.log('x:', xVal, 'y:', yVal, 'z:', zVal);
    console.log('  x:', xVal.toString(2).padStart(46, '0'));
    console.log('  y:', yVal.toString(2).padStart(46, '0'));
    console.log('-'.padEnd(52, '-'));
    console.log('sum:', (xVal+yVal).toString(2).padStart(46, '0'));
    console.log('  z:', zVal.toString(2).padStart(46, '0'));

    const x0 = wires.get('x00')!;
    const y0 = wires.get('y00')!;
    const z0 = wires.get('z00')!;
    const xor0 = x0.output.find(
        g => g instanceof XOR
    );
    const and0 = x0.output.find(
        g => g instanceof AND
    );

    if (!xor0 || !and0) {
        throw new Error('jfdlkd');
    }

    let carryIn = wiresByGate.get(and0);
    if (!carryIn) {
        throw new Error('initial carryIn missing');
    }
    if (z0.input !== xor0) {
        throw new Error('z0');
    }

    for (let i = 1; i < 45; i++) {
        const x = wires.get(`x${i.toString(10).padStart(2, '0')}`);
        const y = wires.get(`y${i.toString(10).padStart(2, '0')}`);
        const z = wires.get(`z${i.toString(10).padStart(2, '0')}`);
        if (!x || !y || !z) {
            throw new Error('loop');
        }

        // first xor
        let xor1 = x.output.find(
            g => g instanceof XOR
        );
        if (!xor1) {
            wrongGates.add(x.name);
            xor1 = y.output.find(
                g => g instanceof XOR
            );
            if (!xor1)
                throw new Error('missing xor');
        }
        const xor1out = wiresByGate.get(xor1);
        if (!xor1out) {
            throw new Error('xor output missing');
        }
        if (!y.output.includes(xor1)) {
            wrongGates.add(y.name);
        }

        // first and
        let and1 = x.output.find(
            g => g instanceof AND
        );
        if (!and1) {
            wrongGates.add(x.name);
            and1 = y.output.find(
                g => g instanceof AND
            );
            if (!and1)
                throw new Error('missing and');
        }
        const and1out = wiresByGate.get(and1);
        if (!and1out) {
            throw new Error('and output missing');
        }
        if (!y.output.includes(and1)) {
            wrongGates.add(y.name);
        }

        // second xor
        let xor2 = xor1out.output.find(
            g => g instanceof XOR
        );
        if (!xor2) {
            wrongGates.add(xor1out.name);
            xor2 = carryIn!.output.find(
                g => g instanceof XOR
            );
            if (!xor2)
                throw new Error('xor2 missing');
        }
        const xor2out = wiresByGate.get(xor2);
        if (!xor2out) {
            throw new Error('xor2 output missing');
        }
        if (!carryIn!.output.includes(xor2)) {
            wrongGates.add(carryIn.name);
        }
        if (z.input !== xor2) {
            wrongGates.add(xor2out.name);
        }

        // second and
        let and2 = xor1out.output.find(
            g => g instanceof AND
        );
        if (!and2) {
            wrongGates.add(xor1out.name);
            and2 = carryIn.output.find(
                g => g instanceof AND
            );
            if (!and2)
                throw new Error('and2 missing');
        }
        if (!carryIn!.output.includes(and2)) {
            wrongGates.add(carryIn!.name);
        }
        const and2out = wiresByGate.get(and2);
        if (!and2out) {
            throw new Error('and2 output missing');
        }

        // or gate
        let or = and1out.output.find(
            g => g instanceof OR
        );
        if (!or) {
            wrongGates.add(and1out.name);
            or = and2out.output.find(
                g => g instanceof OR
            );
            if (!or) {
                throw new Error('missing or');
            }
        }
        if (!and2out.output.includes(or)) {
            wrongGates.add(and2out.name);
        }
        carryIn = wiresByGate.get(or);
        if (!carryIn) {
            throw new Error('no carryIn');
        }
    }

    // const x00 = wires.get('x00');
    // const y00 = wires.get('y00');
    // const z00 = wires.get('z00');
    // if (!x00 || x00.output.length !== 2) {
    //     throw new Error('x00 error');
    // }
    // if (!y00 || y00.output.length !== 2) {
    //     throw new Error('y00 error');
    // }
    // if (!z00) {
    //     throw new Error('z00 error');
    // }
    // let sum1: Wire | undefined;
    // let carry1: Wire | undefined;
    // let carryIn: Wire | undefined;
    // let xor = x00.output.filter(g => g instanceof XOR)?.[0];
    // let and = x00.output.filter(g => g instanceof AND)?.[0];
    // if (!xor || !and) {
    //     throw new Error('initial gate error');
    // }
    // if (z00.input !== xor) {
    //     throw new Error('half adder error');
    // }
    // carryIn = wiresByGate.get(and);
    // if (!carryIn) {
    //     throw new Error('carryIn error');
    // }
    // for (let i = 1; i < 44; i++) {
    //     const x = wires.get(`x${i.toString(10).padStart(2, '0')}`);
    //     const y = wires.get(`y${i.toString(10).padStart(2, '0')}`);
    //     const z = wires.get(`z${i.toString(10).padStart(2, '0')}`);
    //     if (!x || !y || !z || !carryIn) {
    //         throw new Error('wire error');
    //     }
    //     xor = x.output.filter(g => g instanceof XOR)?.[0];
    //     and = x.output.filter(g => g instanceof AND)?.[0];
    //     if (!xor || !and) {
    //         throw new Error('half adder error');
    //     }
    //     sum1 = wiresByGate.get(xor);
    //     carry1 = wiresByGate.get(and);
    //     if (!sum1 || !carry1) {
    //         throw new Error('half adder error');
    //     }
    //     xor = sum1.output.filter(g => g instanceof XOR)?.[0];
    //     and = sum1.output.filter(g => g instanceof AND)?.[0];
    //     if (!xor || !and) {
    //         console.log('sum1', sum1.name, 'not connected to an XOR and AND');
    //         wrongGates.push(sum1.name);
    //     }
    //     xor = carryIn.output.filter(g => g instanceof XOR)?.[0];
    //     and = carryIn.output.filter(g => g instanceof AND)?.[0];
    //     if (!xor || !and) {
    //         console.log('carryIn', carryIn.name, 'not connected to an XOR and AND');
    //         wrongGates.push(carryIn.name);
    //     }
    //     if (!sum1.output.includes(xor)) {
    //         console.log('sum1', sum1.name, 'and carryIn', carryIn.name, 'do not go to the same XOR');
    //     }
    //     if (!sum1.output.includes(and)) {
    //         console.log('sum1', sum1.name, 'and carryIn', carryIn.name, 'do not go to the same AND');
    //     }
    //     if (carry1.output.length !== 1 || !(carry1.output[0] instanceof OR)) {
    //         console.log('carry1', carry1.name, 'does not go to an OR');
    //         wrongGates.push(carry1.name);
    //     }
    //     if (z.input !== xor) {
    //         console.log('z', z.name, 'does not come from the XOR');
    //         wrongGates.push(z.name);
    //     }
    //     const or = carry1.output[0];
    //     const carry2 = wiresByGate.get(and);
    //     if (!carry2) {
    //         throw new Error('half adder error');
    //     }
    //     if ((or.a !== carry2 && or.a !== carry1) ||
    //         (or.b !== carry2 && or.b !== carry1)
    //     ) {
    //         console.log('carry out or has wrong inputs');
    //     }
    //     carryIn = wiresByGate.get(or);
    // }
    // if (!carryIn || carryIn.name !== 'z45') {
    //     console.log('final carry out error');
    // }
    console.log('wrong gates size:', wrongGates.size);
    const g = [...wrongGates.values()].sort();
    return g.join(',');
}

run(__filename, solve, undefined, {
    reason: 'Multiple examples',
    part1length: 2,
    inputs: {
        selector: 'code',
        indexes: [17, 38],
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [37, 43]
    }
});
