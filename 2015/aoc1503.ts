import { logger, NotImplemented, Options, run } from "aoc-copilot";
import { Point } from "../utils/point";
import { NumericDefaultMap } from "../utils/default-map";

type AdditionalInfo = {
    [key: string]: string;
};

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const houseCounts = new NumericDefaultMap<Point>(0);
    if (part === 1) {
        let x = 0;
        let y = 0;
        // deliver first present
        houseCounts.increment(Point.p(x, y));
        for (const direction of input[0]) {
            switch (direction) {
                case '<': x--;
                    break;
                case '>': x++;
                    break;
                case 'v': y++;
                    break;
                case '^': y--;
                    break;
            }
            houseCounts.increment(Point.p(x, y));
        }
    } else {
        const positions: [number, number][] = [
            [0, 0], // Santa
            [0, 0], // Robo-Santa
        ];
        let santasTurn = true;

        // deliver first present
        houseCounts.increment(Point.p(positions[0]));
        houseCounts.increment(Point.p(positions[1]));

        for (const direction of input[0]) {
            const index = santasTurn ? 0 : 1;
            const position = positions[index];
            switch (direction) {
                case '<': position[0]--;
                    logger.log(santasTurn ? 'Santa' : 'Robo-Santa', 'moves west');
                    break;
                case '>': position[0]++;
                    logger.log(santasTurn ? 'Santa' : 'Robo-Santa', 'moves east');
                    break;
                case 'v': position[1]++;
                    logger.log(santasTurn ? 'Santa' : 'Robo-Santa', 'moves south');
                    break;
                case '^': position[1]--;
                    logger.log(santasTurn ? 'Santa' : 'Robo-Santa', 'moves north');
                    break;
            }
            houseCounts.increment(Point.p(position));
            logger.log(santasTurn ? 'Santa' : 'Robo-Santa', 'delivers at', position);
            santasTurn = !santasTurn;
        }
    }
    return houseCounts.size;
}

const options: Options = {};
const args: string[] = process.argv.splice(2);
for (const arg of args) {
    if (arg === '-t') options.testsOnly = true;
    if (arg === '-s') options.skipTests = true;
    if (arg === '1') options.onlyPart = 1;
    if (arg === '2') options.onlyPart = 2;
}

run(__filename, solve, options);
