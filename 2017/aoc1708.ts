import { logger, NotImplemented, run } from "aoc-copilot";
import { DefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /(?<reg>\w+) (?<op>(inc)|(dec)) (?<val>-?\d+) if (?<arg>\w+) (?<cond>([<>]=?)|([!=]=)) (?<condarg>-?\d+)/u;

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const registers = new DefaultMap<string, number>(0);
    let max = Number.MIN_SAFE_INTEGER;
    for (const line of input) {
        const matches = line.match(RE);
        if (!matches || !matches.groups) {
            throw new Error('re errror');
        }
        const {reg, op, val: _val, arg, cond, condarg: _condarg} = matches.groups;
        const val = Number(_val);
        const condarg = Number(_condarg);
        const regVal = registers.get(arg);
        let isValid = false;
        switch (cond) {
            case '<': isValid = regVal < condarg; break;
            case '<=': isValid = regVal <= condarg; break;
            case '>': isValid = regVal > condarg; break;
            case '>=': isValid = regVal >= condarg; break;
            case '==': isValid = regVal === condarg; break;
            case '!=': isValid = regVal !== condarg; break;
            default:
                throw new Error('unknown condition: ' + cond);
        }
        if (isValid) {
            if (op === 'inc') {
                registers.set(reg, registers.get(reg) + val);
            } else {
                registers.set(reg, registers.get(reg) - val);
            }
            max = Math.max(max, registers.get(reg))
        }
    }
    if (part === 1) {
        return Math.max(...registers.values());
    }
    return max;
}

run(__filename, solve);
