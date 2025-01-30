import { logger, NotImplemented, run } from "aoc-copilot";
import { calculateKnotHash } from "../utils/knot-hash";
import { take } from "../utils/take";
import { countOnes } from "../utils/count-ones";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const grid: string[] = [];
    let ones = 0;
    for (let row = 0; row < 128; row++) {
        const hash = calculateKnotHash(`${input[0]}-${row}`);
        grid.push(hash);
        ones += [...take(8, hash)].reduce(
            (acc, x) => acc + countOnes(parseInt(x.join(''), 16)),
            0
        )
    }
    if (part === 1) {
        logger.log(input[0]);
        for (let row = 0; row < 8; row++) {
            logger.log(parseInt(grid[row].slice(0,2), 16).toString(2).padStart(8, '0').replaceAll('0', '.').replaceAll('1', '#'), grid[row]);
        }
        return ones;
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve, undefined, undefined, [
    {
        part: 1,
        inputs: ['hxtvlmkl'],
        answer: '8214'
    }
]);

/*
##.#.#..  d4
.#.#.#.#  55
....#.#.  0a
#.#.##.#  ad
.##.#...  68
##..#..#  c9
.#...#..  44
##.#.##.  d6
*/
