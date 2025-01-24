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
    const steps = input.map(Number);
    let count = 0;
    let position = 0;
    while (position >= 0 && position < steps.length) {
        count++;
        const move = steps[position];
        steps[position]++;
        if (part === 2 && move >= 3) {
            steps[position] -= 2;
        }
        position += move;
    }
    return count;
}

run(__filename, solve);
