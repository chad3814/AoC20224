import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function attempt(designs: string[], request: string): boolean {
    for (const design of designs) {
        if (design === request) {
            return true;
        }
        if (request.startsWith(design)) {
            const sub = attempt(designs, request.substring(design.length));
            if (sub) return true;
        }
    }
    return false;
}

function countSuccesses(designs: string[], request: string): number {
    let count = 0;
    const queue = [request];
    while (queue.length > 0) {
        const item = queue.shift()!;
        for (const design of designs) {
            if (design === item) {
                count++;
                continue;
            }
            if (item.startsWith(design)) {
                queue.push(item.substring(design.length));
            }
        }
    }
    return count;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const designs = input[0].split(', ');
    const requests = input.slice(2);
    if (part === 1) {
        let count = 0;
        for (const request of requests) {
            if (attempt(designs, request)) count++;
        }
        return count;
    }
    designs.sort(
        (a, b) => {
            if (a.length === b.length) {
                return b.localeCompare(a);
            }
            return b.length - a.length;
        }
    );
    let count = 0;
    for (const request of requests) {
        count += countSuccesses(designs, request);
    }
    return count;
}

type AocCopilotOptions = {
    testsOnly?: boolean;
    skipTests?: boolean;
    onlyPart?: 1|2;
    forceSubmit?: boolean;
};
const options: AocCopilotOptions = {}

const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
    if (arg === '-f') options.forceSubmit = true;
}

run(__filename, solve, options);
