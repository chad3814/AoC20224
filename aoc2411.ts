import { NotImplemented, run } from "aoc-copilot";
import { inspect } from "util";

type AdditionalInfo = {
    [key: string]: string;
};

function transform(x: number): number[] {
    if (transform.map.has(x)) {
        return transform.map.get(x)!;
    }
    if (x === 0) {
        return [1];
    }
    const y = x.toString(10);
    if (y.length % 2 === 0) {
        const z = [parseInt(y.substring(0, y.length / 2)), parseInt(y.substring(y.length / 2))];
        transform.map.set(x, z);
        return z;
    }
    transform.map.set(x, [x*2024]);
    return [x * 2024];
}
transform.map = new Map<number,number[]>();

type Node = {
    value: number;
    nodes: Node[];
}

const stoneMap = new Map<number, Node>();
function makeNodes(stone: number, maxLevels: number): Node|null {
    let root = stoneMap.get(stone);
    if (root) {
        return root;
    }
    root = {
        value: stone,
        nodes: [],
    };
    stoneMap.set(stone, root);
    if (maxLevels < 1) {
        return null;
    }
    const stones = transform(stone);
    for (const s of stones) {
        const node = makeNodes(s, maxLevels - 1);
        if (node) {
            root.nodes.push(node);
        }
    }
    return root;
}

function countNodes(root: Node, maxLevel: number): number {
    if (maxLevel === 0) {
        return 1;
    }
    let total = 0;
    for (const node of root.nodes) {
        total += countNodes(node, maxLevel - 1);
    }
    return total;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    let stones = input[0].split(' ').map(i => parseInt(i, 10));
    if (part === 1) {
        for (let i = 0; i < 25; i++) {
            stones = stones.map(s => transform(s)).flat();
        }
        return stones.length;
    }
    let count = 0;
    const roots: Node[] = [];
    for (const stone of stones) {
        const root = makeNodes(stone, 25);
        if (!root) {
            throw new Error('no root');
        }
        roots.push(root);
    }
    for(const root of roots) {
        count += countNodes(root, 25);
    }
    return count;
}

run(__filename, solve, undefined, {
    reason: 'aslk',
    part1length: 0,
    inputs: {
        selector: 'code',
        indexes: []
    },
    answers: {
        selector: 'code',
        indexesOrLiterals: [],
    }
}, [{
    part: 1,
    inputs: ['125 17'],
    answer: '55312'
}]);
