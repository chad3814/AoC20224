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
    const rows = input.map(line => line.split(/\s+/).map(Number));
    let sum = 0;
    if (part === 1) {
        for (const row of rows) {
            const min = Math.min(...row);
            const max = Math.max(...row);
            sum += max - min;
        }
        return sum;
    }
    for (const row of rows) {
        for (let i = 0; i < row.length; i++) {
            for (let j = i + 1; j < row.length; j++) {
                const m = Math.min(row[i], row[j]);
                const n = Math.max(row[i], row[j]);
                if (n % m === 0) {
                    sum += n / m;
                }
            }
        }
    }
    return sum;
}

run(__filename, solve);
