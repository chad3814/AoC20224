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
    const cell = parseInt(input[0], 10);
    if (part === 1) {
        /*
        17  16  15  14  13  30
        18   5   4   3  12  29
        19   6   1   2  11  28
        20   7   8   9  10  27
        21  22  23  24  25  26

        from 1, it moves 1, turns left, moves 1 turns left, moves 2 turns left,
        moves 2 turn, 3 turn, 3 turn, 4, 4, 5, 5...
        so to find the corners repeatedly add in this pattern until the value is
        bigger than the target. the number of times you added indicate the number
        of lines. The number of lines % 4 indicates the line direction, y+, x+, y-, x-
        The cieling of the number of lines / 4, is how far from the center the line
        is. Example, 12. 1 + 1 + 1 + 2 + 2 + 3 + 3 = 13; 6 lines. 6 % 4 is 2, so
        direction is y- (going up). ciel(6/4) = 2; 2 - (6 % 2) = 2, so it is two
        lines from the start. The last number added was 3, floor(3/2) = 1, 3 - 1 = 2,
        13 - 2 is the number that is on the same row/col as the start, so that number
        is the above lines from the start, orthongonal to the current line. 13-2 = 11.
        The number 12 is abs(11 - 12) = 1 away, so: 12 is distance 1 + 2 = 3.

        For 23:
         1 + 1 + 1 + 2 + 2 + 3 + 3 + 4 + 4 + 5 = 26
         lines = 9
         direction = 9 % 4 = 1, x+
         lineDist = 2; ciel(9 / 4) = 3; 3 - (9 % 2) = 2
         center = 23; floor(5 / 2) = 2; 5 - 2 = 3; 26 - 3 = 23
         centerDist = abs(23 - 23) = 0;
         distance = lineDist + centerDist = 2

        For 29:
         1 + 1 + 1 + 2 + 2 + 3 + 3 + 4 + 4 + 5 + 5 = 31
         lines = 10
         direction = 10 % 4 + 2, y-
         lineDist = 3; ciel(10 / 4) = 3; 3 - (10 % 2) = 3
         center = 28; floor(5 / 2) = 2; 5 - 2 = 3; 31 - 3 = 28
         centerDist = abs(28 - 29) = 1
         distance = lineDist + centerDist = 4
        */
        let sum = 1;
        let lines = 0;
        let lastVal = 0;
        while (sum < cell) {
            lastVal = Math.floor(lines / 2) + 1;
            sum += lastVal;
            lines++;
        }
        const lineDist = Math.ceil(lines / 4) - (lines % 2);
        const center = sum - (lastVal - Math.floor(lastVal / 2));
        const centerDist = Math.abs(center - cell);
        return lineDist + centerDist;
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
