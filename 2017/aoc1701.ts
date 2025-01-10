import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const line = input[0].split('').map(Number);
    let sum = 0;
    if (part === 1) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === line[(i+1)%line.length]) {
                sum += line[i];
            }
        }
        return sum;
    }
    const half = line.length / 2;
    for (let i = 0; i < line.length; i++) {
        if (line[i] === line[(i+half)%line.length]) {
            sum += line[i];
        }
    }
    return sum;
}

run(__filename, solve);
