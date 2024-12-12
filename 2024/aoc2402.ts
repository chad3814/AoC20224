import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Report = number[];
function isSafe(report: Report): boolean {
    let isDecreasing = false;
    if (report.length >= 2) {
        isDecreasing = report[0] > report[1];
    }
    let safe = true;
    for (let i = 1; i < report.length; i++) {
        if (isDecreasing) {
            if (report[i-1] <= report[i] || (report[i-1] - report[i]) > 3) {
                safe = false;
                break;
            }
        } else {
            if (report[i-1] >= report[i] || (report[i] - report[i-1]) > 3) {
                safe = false;
                break;
            }
        }
    }
    return safe;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const reports: Report[] = [];
    for (const line of input) {
        reports.push(line.split(/\s+/g).map(i => parseInt(i)))
    }
    if (part === 1) {
        let safe = 0;
        for (const report of reports) {
            if (isSafe(report)) {
                safe++;
            }
        }
        return safe;
    }
    let safe = 0;
    for (const report of reports) {
        if (isSafe(report)) {
            safe++;
            continue;
        }
        for (let i = 0; i < report.length; i++) {
            const subReport = report.slice();
            subReport.splice(i, 1);
            if (isSafe(subReport)) {
                safe++;
                break;
            }
        }
    }
    return safe;
}

run(__filename, solve);
