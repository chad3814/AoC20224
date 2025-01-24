import { logger, NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

class Program {
    static P(name: string, weight: number, subprogramNames: string[]): Program {
        logger.log(name, weight, subprogramNames);
        const programs: Program[] = [];
        for (const subprogramName of subprogramNames) {
            const subprogram = this.map.get(subprogramName) ?? new Program(subprogramName, -1, []);
            programs.push(subprogram);
        }
        if (this.map.has(name)) {
            const p = this.map.get(name)!;
            p.subprograms.length = 0;
            for (const program of programs) {
                program.parent = p;
                p.subprograms.push(program);
            }
            p._weight = weight;
            return p;
        }
        const program = new Program(name, weight, programs);
        programs.forEach(
            p => p.parent = program
        );
        return program;
    }

    public get weight() {
        return this._weight;
    }

    public towerWeight(): number {
        let total = this._weight;
        for (const subprogram of this.subprograms) {
            total += subprogram.towerWeight();
        }
        return total;
    }

    public isBalanced(): boolean {
        if (this.subprograms.length === 0) {
            return true;
        }
        const first = this.subprograms[0].towerWeight();
        return this.subprograms.every(
            s => s.towerWeight() === first
        );
    }

    public parent: Program|null = null;
    private constructor(public readonly name: string, private _weight: number, public readonly subprograms: Program[]) {
        Program.map.set(name, this);
    }
    private static map = new Map<string, Program>();
}

function differentIndex(values: number[]): number {
    const first = values[0];
    const last = values.at(-1);
    if (first !== last) {
        if (first === values[1]) {
            return values.length - 1;
        }
        return 0;
    }
    for (let i = 1; i < values.length; i++) {
        if (values[i] !== first) {
            return i;
        }
    }
    return -1;
}

const RE = /(?<name>[a-z]+) \((?<weight>\d+)\)( -> (?<subprograms>([a-z]+, )*([a-z]+)))?/u;
export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const programs: Program[] = [];
    for (const line of input) {
        if (line === '') continue;
        const match = line.match(RE);
        if (!match || !match.groups) {
            logger.error('line:', line, 'failed match');
            throw new Error('bad match');
        }
        const subprogramNames = match.groups.subprograms?.split(', ') ?? [];
        programs.push(Program.P(match.groups.name, Number(match.groups.weight), subprogramNames));
    }

    const roots = programs.filter(
        p => p.parent === null
    );
    if (roots.length === 0) {
        throw new Error('failed to find root');
    }
    if (roots.length > 1) {
        logger.error('too many roots', roots.map(r => r.name));
    }

    if (part === 1) {
        return roots[0].name;
    }

    let root = roots[0];
    while (!root.isBalanced()) {
        const index = differentIndex(root.subprograms.map(s => s.towerWeight()));
        if (index < 0) {
            throw new Error('invalid index');
        }
        root = root.subprograms[index];
    }
    if (!root.parent) {
        throw new Error('invalid root');
    }
    const siblings = root.parent.subprograms.filter(s => s !== root)
    const required = siblings[0].towerWeight();
    logger.log('root:', root.name, root.weight, root.towerWeight());
    logger.log('subling:', siblings[0].name, siblings[0].weight, siblings[0].towerWeight());
    return required - root.towerWeight() + root.weight;
}

run(__filename, solve);
