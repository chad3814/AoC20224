import { NotImplemented, run } from "aoc-copilot";
import { Direction, Graph, Turn, turnsFromPath } from "../utils/graph2";

type AdditionalInfo = {
    [key: string]: string;
};

function turnsCost(turns: Turn[]): number {
    return turns.reduce(
        (total, turn) => {
            if (turn === Turn.STRAIGHT) {
                return total + 1;
            }
            if (turn === Turn.UTURN) {
                return total + 2000;
            }
            return total + 1000;
        }, 0
    );
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const graph = new Graph(input);
    if (part === 1) {
        if (test) graph.print();

        const start = graph.pointsOfInterest.get('S');
        const end = graph.pointsOfInterest.get('E');
        if (!start || !end) {
            throw new Error('missing a poi');
        }
        const path = graph.cheapestPath(start[0], end[0], (
            (path, p) => turnsCost(turnsFromPath(Direction.EAST, [...path, p]))
        ));
        return turnsCost(turnsFromPath(Direction.EAST, path));
        // const costs: number[] = [];
        // console.log('found', paths.length, 'paths');
        // for (const path of paths) {
            // console.log('path:', path.join(', '));
            // const turns = turnsFromPath(Direction.EAST, path);
            // if (test) graph.print(
            //     (v, p) => {
            //         const i = path.indexOf(p);
            //         if (i === path.length - 1 || i === -1) return v;
            //         switch (turns[i]) {
            //             case Turn.LEFT: return 'L';
            //             case Turn.RIGHT: return 'R';
            //             case Turn.STRAIGHT: return 'S';
            //             default: return 'U';
            //         }
            //     }
            // );
            // const cost = turns.reduce(
            //     (total, turn) => {
            // );
            // if (test) console.log('cost:', cost);
            // if (test && cost === 7029) console.log('turns:', turns.map(
            //     t => t === Turn.LEFT ? 'left' :
            //          t === Turn.RIGHT ? 'right' :
            //          t === Turn.UTURN ? 'u-turn' :
            //          'straight'
            // ));

            // costs.push(cost);
        // }
        // return Math.min(...costs);
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
