import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Node = {
    height: number;
    neighbors: Node[];
    visited: boolean;
}

function reset(nodes: Node[][]) {
    for (const row of nodes) {
        for (const cell of row) {
            cell.visited = false;
        }
    }
}

function walk1(node: Node): number {
    if (node.height === 9) {
        if (node.visited) {
            return 0;
        }
        node.visited = true;
        return 1;
    }
    let count = 0;
    for (const neighbor of node.neighbors) {
        if (neighbor.height === node.height + 1) {
            count += walk1(neighbor);
        }
    }
    return count;
}

function walk2(node: Node): number {
    if (node.height === 9) {
        return 1;
    }
    node.visited = true;
    let count = 0;
    for (const neighbor of node.neighbors) {
        if (neighbor.height === node.height + 1 && !neighbor.visited) {
            count += walk2(neighbor);
            neighbor.visited = false;
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
    const trailHeads: Node[] = [];
    const elevations: Node[][] = [];
    for (const line of input) {
        elevations.push(
            line.split('').map(
                h => ({
                    height: parseInt(h, 10),
                    neighbors: [],
                    visited: false,
                })
            )
        );
    }
    for (let y = 0; y < elevations.length; y++) {
        for (let x = 0; x < elevations[0].length; x++) {
            const node = elevations[y][x];
            if (node.height === 0) {
                trailHeads.push(node);
            }
            if (x > 0) {
                node.neighbors.push(elevations[y][x-1]);
            }
            if (x < elevations[0].length - 1) {
                node.neighbors.push(elevations[y][x+1]);
            }
            if (y > 0) {
                node.neighbors.push(elevations[y-1][x]);
            }
            if (y < elevations.length - 1) {
                node.neighbors.push(elevations[y+1][x]);
            }
        }
    }
    if (part === 1) {
        let count = 0;
        for (const trailHead of trailHeads) {
            reset(elevations);
            count += walk1(trailHead);
        }
        return count;
    }
    let count = 0;
    for (const trailHead of trailHeads) {
        reset(elevations);
        count += walk2(trailHead);
    }
    return count;
}

run(__filename, solve, {
    testsOnly: false,
},{
    reason: "wrong",
    part1length: 1,
    inputs: {
        selector: 'code',
        indexes: [18, 41]
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [28, 51]
    }
});
