import { NotImplemented, run } from "aoc-copilot";
import { take } from "../utils/take";
import { calculateKnotHash, twist } from "../utils/knot-hash";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const loop: number[] = [];
    if (part === 1) {
        const size = test ?  5 : 256;
        for (let i = 0; i < size; i++) {
            loop[i] = i;
        }
        const lengths = input[0].split(',').map(Number);
        twist(loop, lengths);
        return loop[0] * loop[1];
    }

    return calculateKnotHash(input[0]);
}

run(__filename, solve);
