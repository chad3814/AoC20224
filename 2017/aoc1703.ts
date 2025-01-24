import { NotImplemented, run, logger } from "aoc-copilot";
import { Direction, DirectionOffset, dLeft, turnLeft } from "../utils/direction";
import { Point } from "../utils/point";

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
        1025 1024 1023 1022 ...1009...8 997 996 995 994 993
                                ...
                             56 lines
                                ...
        145 144 143 142 141 140 139 138 137 136 135 134 133
        146 101 100  99  98  97  96  95  94  93  92  91 132
        147 102  65  64  63  62  61  60  59  58  57  90 131
        148 103  66  37  36  35  34  33  32  31  56  89 130
        149 104  67  38  17  16  15  14  13  30  55  88 129
        150 105  68  39  18   5   4   3  12  29  54  87 128
        151 106  69  40  19   6   1   2  11  28  53  86 127
        152 107  70  41  20   7   8   9  10  27  52  85 126
        153 108  71  42  21  22  23  24  25  26  51  84 125
        154 109  72  43  44  45  46  47  48  49  50  83 124
        155 110  73  74  75  76  77  78  79  80  81  82 123
        156 111 112 113 114 115 116 117 118 119 120 121 122
        157 158 159 160 161 162 163 164 165 166 167 168 169 170

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
         direction = 10 % 4 = 2, y-
         lineDist = 3; ciel(10 / 4) = 3; 3 - (10 % 2) = 3
         center = 28; floor(5 / 2) = 2; 5 - 2 = 3; 31 - 3 = 28
         centerDist = abs(28 - 29) = 1
         distance = lineDist + centerDist = 4

        For 36:
         1 + 1 + 1 + 2 + 2 + 3 + 3 + 4 + 4 + 5 + 5 + 6 = 37
         lines = 11
         direction = 11 % 4 = 3, x-
         lineDist = 3; ceil(11 / 4) = 3; 3 ???
         center = 34; floor(6 / 2) = 3; 6 - 3 = 3; 37 - 3 = 34
         centerDist = abs(36 - 34) = 2
         distance = lineDist + centerDist = 5

        For 21:
         1 + 1 + 1 + 2 + 2 + 3 + 3 + 4 + 4 = 21
         lines = 8
         direction = 8 % 4 = 0, y+
         lineDist = 2; ceil(8 / 4) = 2; 2 - (8 % 2) = 2
         center = 19; floor(4 / 2) = 2; 4 - 2 = 2; 21 - 2 = 19
         centerDist = abs(21 - 19) = 2
         distance = lineDist + centerDist = 4
        */
        let sum = 1;
        let lines = 0;
        let lastVal = 0;
        while (sum < cell) {
            lastVal = Math.floor(lines / 2) + 1;
            sum += lastVal;
            logger.log('corner:', sum);
            lines++;
        }
        const direction = lines %4;
        logger.log('cell:', cell, 'sum:', sum, 'lines:', lines, 'lastVal:', lastVal, 'dir:', ['y+', 'x+', 'y-', 'x-'][direction]);
        const lineDist = Math.ceil(lines / 4) - (direction === 1 ? 1 :0);
        const center = sum - (lastVal - Math.floor(lastVal / 2));
        const centerDist = Math.abs(center - cell);
        logger.log('lineDist:', lineDist, 'center:', center, 'centerDist:', centerDist);
        return lineDist + centerDist;
    }
    /*
        147 142 133 122  59
        304   5   4   2  57
        330  10   1   1  54
        351  11  23  25  26
        362 747 806 880 931 957

    */
    const grid = new Map<Point, number>();
    grid.set(Point.p(0, 0),1);
    let dir: Direction = Direction.SOUTH;
    let x = 0;
    let y = 0;
    let nextVal = -1;
    do {
        let nextCell = Point.p(x + DirectionOffset[dir][0], y + DirectionOffset[dir][1]);
        const left = Point.p(nextCell.x + DirectionOffset[turnLeft(dir)][0], nextCell.y + DirectionOffset[turnLeft(dir)][1]);
        if (!grid.has(left)) {
            dir = turnLeft(dir);
            const potential = Point.p(x + DirectionOffset[dir][0], y + DirectionOffset[dir][1]);
            if (!grid.has(potential)) {
                nextCell = potential;
            } // else it stays
        }
        logger.log('nextCell:', nextCell);
        nextVal = 0;
        for (const adj of nextCell.adjacentPoints(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true)) {
            logger.log('adj:', adj, grid.get(adj) ?? 0);
            nextVal += grid.get(adj) ?? 0;
        }
        grid.set(nextCell, nextVal);
        x = nextCell.x;
        y = nextCell.y;
        logger.log('nextVal:', nextVal);
    } while (nextVal <= cell);
    return nextVal;
}

run(__filename, solve, undefined, undefined, [
    {
        part: 2,
        inputs: ["950"],
        answer: "957"
    },
    {
        part: 2,
        inputs: ["25"],
        answer: "26"
    },
    {
        part: 2,
        inputs: ["300"],
        answer: "304"
    }
]);
