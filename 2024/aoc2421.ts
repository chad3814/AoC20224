import { NotImplemented, run } from "aoc-copilot";
import { memoize } from "../utils/memoize";

type AdditionalInfo = {
    [key: string]: string;
};


const keypad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [' ', '0', 'A'],
];
const dpad = [
    [' ', '^', 'A'],
    ['<', 'v', '>'],
];

const digitPositions = new Map<string, [number, number]>();
digitPositions.set('0', [1, 3]);
digitPositions.set('1', [0, 2]);
digitPositions.set('2', [1, 2]);
digitPositions.set('3', [2, 2]);
digitPositions.set('4', [0, 1]);
digitPositions.set('5', [1, 1]);
digitPositions.set('6', [2, 1]);
digitPositions.set('7', [0, 0]);
digitPositions.set('8', [1, 0]);
digitPositions.set('9', [2, 0]);
digitPositions.set('A', [2, 3]);
const directionPositions = new Map<string, [number, number]>();
directionPositions.set('^', [1, 0]);
directionPositions.set('A', [2, 0]);
directionPositions.set('<', [0, 1]);
directionPositions.set('v', [1, 1]);
directionPositions.set('>', [2, 1]);

function firstRobot(code: string): string {
    let [x, y] = digitPositions.get('A')!;
    const ret: string[] = [];
    for (const c of code) {
        const [cX, cY] = digitPositions.get(c)!;
        while (x !== cX || y !== cY) {
            if (x > cX && !(cX === 0 && y === 3)) {
                while (x !== cX) {
                    x--;
                    ret.push('<');
                }
            } else if (y > cY) {
                while (y !== cY) {
                    y--;
                    ret.push('^');
                }
            } else if (y < cY && !(cY === 3 && x === 0)) {
                while (y !== cY) {
                    y++;
                    ret.push('v');
                }
            } else if (x < cX) {
                while (x !== cX) {
                    x++;
                    ret.push('>');
                }
            }
        }
        ret.push('A');
    }

    return ret.join('');
}

const otherRobots = memoize<void, [string, number], number>(2)((directions: string, repeat: number): number => {
    if (repeat === 0) {
        return directions.length;
    }

    let [x, y] = directionPositions.get('A')!;
    let ret: string[] = [];
    for (const dir of directions) {
        const [cX, cY] = directionPositions.get(dir)!;

        while (x !== cX || y !== cY) {
            if (x > cX && !(cX === 0 && y === 0)) {
                while (x !== cX) {
                    x--;
                    ret.push('<');
                }
            } else if (y > cY && !(cY === 0 && x === 0)) {
                while (y !== cY) {
                    y--;
                    ret.push('^');
                }
            } else if (y < cY) {
                while (y !== cY) {
                    y++;
                    ret.push('v');
                }
            } else if (x < cX) {
                while (x !== cX) {
                    x++;
                    ret.push('>');
                }
            }
        }
        ret.push('A');
    }

    const dir = ret.join('');
    let total = 0;
    const subcodes = dir.match(/.*?A/g) || [];
    for (const subcode of subcodes) {
        total += otherRobots(subcode, repeat - 1);
    }
    return total;
});

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const codes = input.filter(s => s !== '');

    const numRobots = part === 1 ? 2 : 25;
    let result = 0;
    for (const code of codes) {
        const dir = firstRobot(code);

        let length = 0;
        for (const part of dir.match(/.*?A/g)!) {
            length += otherRobots(part, numRobots);
        }

        result += length * parseInt(code.substring(0,3), 10);
    }
    return result;
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

run(__filename, solve, options);
