import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

const symbolScore: {
    A: 1;
    B: 2;
    C: 3;
    X: 1;
    Y: 2;
    Z: 3;
} = {
    A: 1,
    B: 2,
    C: 3,
    X: 1,
    Y: 2,
    Z: 3,
};

const winScore: {
    A: {
        A: 3;
        B: 0;
        C: 6;
    };
    B: {
        A: 6;
        B: 3;
        C: 0;
    };
    C: {
        A: 0;
        B: 6;
        C: 3;
    };
    X: {
        A: 3;
        B: 0;
        C: 6;
    };
    Y: {
        A: 6;
        B: 3;
        C: 0;
    };
    Z: {
        A: 0;
        B: 6;
        C: 3;
    };
} = {
    A: {
        A: 3,
        B: 0,
        C: 6,
    },
    B: {
        A: 6,
        B: 3,
        C: 0,
    },
    C: {
        A: 0,
        B: 6,
        C: 3,
    },
    X: {
        A: 3,
        B: 0,
        C: 6,
    },
    Y: {
        A: 6,
        B: 3,
        C: 0,
    },
    Z: {
        A: 0,
        B: 6,
        C: 3,
    },
};

const throwType: {
    X: {
        A: 'C';
        B: 'A';
        C: 'B';
    };
    Y: {
        A: 'A';
        B: 'B';
        C: 'C';
    };
    Z: {
        A: 'B';
        B: 'C';
        C: 'A';
    };
} = {
    X: {
        A: 'C',
        B: 'A',
        C: 'B',
    },
    Y: {
        A: 'A',
        B: 'B',
        C: 'C',
    },
    Z: {
        A: 'B',
        B: 'C',
        C: 'A',
    },
}


export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    if (part === 1) {
        let score = 0;
        for (const line of input) {
            const [opponent, me] = line.split(' ') as ['A'|'B'|'C', 'X'|'Y'|'Z'];
            score += symbolScore[me] + winScore[me][opponent];
        }
        return score;
    }
    let score = 0;
    for (const line of input) {
        const [opponent, type] = line.split(' ') as ['A'|'B'|'C', 'X'|'Y'|'Z'];
        const me = throwType[type][opponent];
        console.log(line, me, symbolScore[me], winScore[me][opponent]);
        score += symbolScore[me] + winScore[me][opponent];
    }
    return score;
}

run(__filename, solve);
