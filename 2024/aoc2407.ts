import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Calibration = {
    value: number;
    nums: number[];
};

enum Operators {
    PLUS,
    MULTIPLY,
    CONCATENATE,
};

function evaluate(num: number[], operators: Operators[]): number {
    let value = num[0];
    for (let i = 1; i < num.length; i++) {
        if (operators[i-1] === Operators.MULTIPLY) {
            value *= num[i];
        } else if (operators[i-1] === Operators.PLUS) {
            value += num[i];
        } else {
            value = parseInt(value + '' + num[i], 10);
        }
    }
    return value;
}

function isPossible(calibration: Calibration, numOperators: number): boolean {
    const operators: Operators[] = new Array(calibration.nums.length - 1).fill(Operators.PLUS);
    for (let i = 0; i < numOperators**operators.length; i++) {
        const bits = i.toString(numOperators).padStart(operators.length, '0');
        for (let j = 0; j < bits.length; j++) {
            operators[j] = bits[j] === '0' ? Operators.PLUS :
            (bits[j] === '1' ? Operators.MULTIPLY : Operators.CONCATENATE);
        }
        const value = evaluate(calibration.nums, operators);
        if (value === calibration.value) {
            return true;
        }
    }
    return false;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const calibrations: Calibration[] = [];
    for (const line of input) {
        const [value, nums] = line.split(': ');
        calibrations.push({
            value: parseInt(value),
            nums: nums.split(' ').map(n => parseInt(n, 10)),
        });
    }
    let total = 0;
    if (part === 1) {
        for (const calibration of calibrations) {
            if (isPossible(calibration, 2)) {
                total += calibration.value;
            }
        }
        return total;
    }
    for (const calibration of calibrations) {
        if (isPossible(calibration, 3)) {
            total += calibration.value;
        }
    }
    return total;
}

run(__filename, solve);
