import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

function moveUp(graph: string[][], robot: [number, number]){
    const x = robot[0];
    let y = robot[1];
    while (y > 0) {
        y--;
        if (graph[y][x] === '#' || graph[y][x] === '.') {
            break;
        }
    }

    if (graph[y][x] === '.') {
        while (y !== robot[1]) {
            graph[y][x] = graph[y + 1][x];
            y++;
        }
        graph[y][x] = '.';
        robot[1]--;
    }
}

function moveDown(graph: string[][], robot: [number, number]){
    const x = robot[0];
    let y = robot[1];
    while (y < graph.length) {
        y++;
        if (graph[y][x] === '#' || graph[y][x] === '.') {
            break;
        }
    }

    if (graph[y][x] === '.') {
        while (y !== robot[1]) {
            graph[y][x] = graph[y - 1][x];
            y--;
        }
        graph[y][x] = '.';
        robot[1]++;
    }
}

function moveLeft(graph: string[][], robot: [number, number]){
    let x = robot[0];
    const y = robot[1];
    while (x > 0) {
        x--;
        if (graph[y][x] === '#' || graph[y][x] === '.') {
            break;
        }
    }

    if (graph[y][x] === '.') {
        while (x !== robot[0]) {
            graph[y][x] = graph[y][x + 1];
            x++;
        }
        graph[y][x] = '.';
        robot[0]--;
    }
}

function moveRight(graph: string[][], robot: [number, number]){
    let x = robot[0];
    const y = robot[1];
    while (x < graph[y].length) {
        x++;
        if (graph[y][x] === '#' || graph[y][x] === '.') {
            break;
        }
    }

    if (graph[y][x] === '.') {
        while (x !== robot[0]) {
            graph[y][x] = graph[y][x - 1];
            x--;
        }
        graph[y][x] = '.';
        robot[0]++;
    }
}

function dump(graph: string[][]) {
    if (graph.length === 0) {
        throw new Error('wtf');
    }
    for (const line of graph) {
        console.log(line.join(''));
    }
}

function doubleWide(graph: string[][]): string[][] {
    const newGraph: string[][] = [];
    for (let y = 0; y < graph.length; y++) {
        const newRow = new Array<string>(graph[y].length * 2).fill('.');
        for (let x = 0; x < graph[y].length; x++) {
            if (graph[y][x] === '@') {
                newRow[x * 2] = '@';
            } else if (graph[y][x] === 'O') {
                newRow[x * 2] = '[';
                newRow[x * 2 + 1] = ']';
            } else {
                newRow[x * 2] = graph[y][x];
                newRow[x * 2 + 1] = graph[y][x];
            }
        }
        newGraph.push(newRow);
    }
    return newGraph;
}

function wideUp(graph: string[][], x: number, y: number): boolean {
    if (y === 0) {
        return false;
    }
    if (graph[y - 1][x] === '#') {
        return false;
    }
    if (graph[y - 1][x] === '[') {
        const above = wideUp(graph, x, y - 1) && wideUp(graph, x + 1, y - 1);
        if (above) {
            graph[y - 2][x] = '[';
            graph[y - 2][x + 1] = ']';
            graph[y - 1][x] = '.';
            graph[y - 1][x + 1] = '.';
        }
        return above;
    }
    if (graph[y - 1][x] === ']') {
        const above = wideUp(graph, x - 1, y - 1) && wideUp(graph, x, y - 1);
        if (above) {
            graph[y - 2][x - 1] = '[';
            graph[y - 2][x] = ']';
            graph[y - 1][x - 1] = '.';
            graph[y - 1][x] = '.';
        }
        return above;
    }
    // else .
    return true;
}

function wideDown(graph: string[][], x: number, y: number): boolean {
    if (y >= graph.length) {
        return false;
    }
    if (graph[y + 1][x] === '#') {
        return false;
    }
    if (graph[y + 1][x] === '[') {
        const below = wideDown(graph, x, y + 1) && wideDown(graph, x + 1, y + 1);
        if (below) {
            graph[y + 2][x] = '[';
            graph[y + 2][x + 1] = ']';
            graph[y + 1][x] = '.';
            graph[y + 1][x + 1] = '.';
        }
        return below;
    }
    if (graph[y + 1][x] === ']') {
        const below = wideDown(graph, x - 1, y + 1) && wideDown(graph, x, y + 1);
        if (below) {
            graph[y + 2][x - 1] = '[';
            graph[y + 2][x] = ']';
            graph[y + 1][x - 1] = '.';
            graph[y + 1][x] = '.';
        }
        return below;
    }
    // else .
    return true;
}

function canWideUp(graph: string[][], x: number, y: number): boolean {
    if (y === 0) {
        return false;
    }
    if (graph[y - 1][x] === '#') {
        return false;
    }
    if (graph[y - 1][x] === '[') {
        return canWideUp(graph, x, y - 1) && canWideUp(graph, x + 1, y - 1);
    }
    if (graph[y - 1][x] === ']') {
        return canWideUp(graph, x - 1, y - 1) && canWideUp(graph, x, y - 1);
    }
    // else .
    return true;
}

function canWideDown(graph: string[][], x: number, y: number): boolean {
    if (y >= graph.length) {
        return false;
    }
    if (graph[y + 1][x] === '#') {
        return false;
    }
    if (graph[y + 1][x] === '[') {
        return canWideDown(graph, x, y + 1) && canWideDown(graph, x + 1, y + 1);
    }
    if (graph[y + 1][x] === ']') {
        return canWideDown(graph, x - 1, y + 1) && canWideDown(graph, x, y + 1);
    }
    // else .
    return true;
}


export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let graph: string[][] = [];
    let inInstructions = false;
    const instructions: string[] = [];
    const robot: [number, number] = [-1, -1];
    for (const line of input) {
        if (line === '') {
            inInstructions = true;
        }
        if (inInstructions) {
            instructions.push(...line.split(''));
        } else {
            graph.push(line.split(''));
            if (line.includes('@')) {
                robot[0] = line.indexOf('@');
                robot[1] = graph.length - 1;
            }
        }
    }

    if (part === 1) {
        if (test) dump(graph);
        for (const instr of instructions) {
            if (instr === '^') {
                moveUp(graph, robot);
            }
            if (instr === '>') {
                moveRight(graph, robot);
            }
            if (instr === 'v') {
                moveDown(graph, robot);
            }
            if (instr === '<') {
                moveLeft(graph, robot);
            }
        }
        if (test) dump(graph);

        let count = 0;
        for (let y = 0; y < graph.length; y++) {
            for (let x = 0; x < graph[y].length; x++) {
                if (graph[y][x] === 'O') {
                    count += y * 100 + x;
                }
            }
        }
        return count;
    }
    graph = doubleWide(graph);
    robot[0] *= 2;

    for (const instr of instructions) {
        if (instr === '^') {
            if (test) dump(graph);
            if (test) console.log('wideUp', robot);
            const move = canWideUp(graph, robot[0], robot[1]);
            if (move) {
                wideUp(graph, robot[0], robot[1]);
                if (test) console.log('wideUp success');
                graph[robot[1]][robot[0]] = '.';
                robot[1]--;
                graph[robot[1]][robot[0]] = '@';
            }
        }
        if (instr === '>') {
            if (test) dump(graph);
            if (test) console.log('moveRight', robot);
            moveRight(graph, robot);
        }
        if (instr === 'v') {
            if (test) dump(graph);
            if (test) console.log('wideDown', robot);
            const move = canWideDown(graph, robot[0], robot[1]);
            if (move) {
                wideDown(graph, robot[0], robot[1]);
                if (test) console.log('wideDown success');
                graph[robot[1]][robot[0]] = '.';
                robot[1]++;
                graph[robot[1]][robot[0]] = '@';
            }
        }
        if (instr === '<') {
            if (test) dump(graph);
            if (test) console.log('moveLeft', robot);
            moveLeft(graph, robot);
        }
    }
    if (test) dump(graph);
    let count = 0;
    for (let y = 0; y < graph.length; y++) {
        for (let x = 0; x < graph[y].length; x++) {
            if (graph[y][x] === '[') {
                count += y * 100 + x;
            }
        }
    }
    return count;
}

const additionInput =
`#######
#.....#
#.....#
#.@O..#
#..#O.#
#...O.#
#..O..#
#.....#
#######

>><vvv>v>^^^`;

run(__filename, solve, undefined, {
    reason: 'hkjds',
    part1length: 2,
    inputs: {
        selector: 'code',
        indexes: [8,0,0],
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [16,15,35]
    }
},[
    {
        part: 2,
        inputs: additionInput.split('\n'),
        answer: '1430',
    },
    {
        part: 2,
        inputs: `######
#....#
#..#.#
#....#
#.O..#
#.OO@#
#.O..#
#....#
######

<vv<<^^^`.split('\n'),
        answer: '1216'
    }
]);
