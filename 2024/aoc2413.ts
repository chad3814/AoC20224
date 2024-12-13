import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const RE = /^((?<prize>Prize)|(Button (?<button>[AB]))): X.(?<x>\d+), Y.(?<y>\d+)$/u
type Machine = {
    a: [number, number];
    b: [number, number];
    prize: [number, number];
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const machines: Machine[] = [];
    let a: [number, number] = [-1, -1];
    let b: [number, number] = [-1, -1];
    for (const line of input) {
        if (line === '') continue;
        const match = line.match(RE);
        if (!match || !match.groups) {
            throw new Error('bad RE');
        }
        if (match.groups.button) {
            if (match.groups.button === 'A') {
                a = [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)];
            } else {
                b = [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)];
            }
        }
        if (match.groups.prize) {
            machines.push({
                a,
                b,
                prize: [parseInt(match.groups.x, 10), parseInt(match.groups.y, 10)],
            });
        }
    }

    let cost = BigInt(0);
    for (const machine of machines) {
        // Button A: X+26, Y+66
        // Button B: X+67, Y+21
        // Prize: X=10000000012748, Y=10000000012176
        // 26a + 67b = 10000000012748
        // 66a + 21b = 10000000012176
        // i=26, j= 67, k=66, l=21
        // ai + bj = prizeX
        // ak + bl = prizeY
        // a = (prizeX - bj)/i
        // b = (prizeY - ak)/l
        // a = (prizeX - j(prizeY - ak)/l)/i
        // ai = prizeX - j(prizeY - ak)/l
        // ai = prizeX - jprizeY/l + ajk/l
        // a(i - jk/l) = prizeX - jprizeY/l
        // a = (prizeX - jprizeY/l)/(i - jk/l);

        /*
            l*prizeX - j*prizeY
        a = -------------------
                l*i - j*k
        */
        const i = BigInt(machine.a[0]);
        const j = BigInt(machine.b[0]);
        const k = BigInt(machine.a[1]);
        const l = BigInt(machine.b[1]);
        const prizeX = BigInt(machine.prize[0] + (part === 1 ? 0 : 10000000000000));
        const prizeY = BigInt(machine.prize[1] + (part === 1 ? 0 : 10000000000000));

        const numerator1 = l * prizeX - j * prizeY;
        const denominator1 = l * i - j * k;
        if (0n === numerator1 % denominator1) {
            const a = numerator1 / denominator1;
            const numerator2 = prizeY - a * k;
            const denominator2 = l;
            if (0n === numerator2 % denominator2) {
                const b = numerator2 / denominator2;
                cost += 3n * a + b;
            }
        }
    }
    return cost.toString(10);
}

run(__filename, solve, {testsOnly: true}, {
    "reason": "Multiple examples",
    "part1length": 1,
    "inputs": {
        "selector": "code",
        "indexes": [8, 8]
    },
    "answers": {
        "selector": "code",
        "indexesOrLiterals": [43, "875318608908"]
    }
});
