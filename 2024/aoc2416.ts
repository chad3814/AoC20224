import { NotImplemented, run } from "aoc-copilot";
import { Graph, turnsFromPath } from "../utils/graph2";
import { Direction, Turn } from "../utils/direction";

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
        const paths = graph.allPaths(start[0], end[0]);
        const costs: number[] = [];
        console.log('found', paths.length, 'paths');
        for (const path of paths) {
            // if (test) console.log('path:', path.join(', '));
            const turns = turnsFromPath(Direction.EAST, path);
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
            const cost = turns.reduce(
                (total, turn) => {
                    if (turn === Turn.LEFT || turn === Turn.RIGHT) {
                        return 1000 + total;
                    }
                    if (turn === Turn.UTURN) {
                        return 2000 + total;
                    }
                    return 1 + total;
                }, 0
            );
            // if (test) console.log('cost:', cost);
            costs.push(cost);
        }
        return Math.min(...costs);
    }
    throw new NotImplemented('Not Implemented');
}

run(__filename, solve);
