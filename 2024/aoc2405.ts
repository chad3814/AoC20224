import { NotImplemented, run } from "aoc-copilot";

type AdditionalInfo = {
    [key: string]: string;
};

type Page = {
    before: number[];
    after: number[];
};

type Update = number[];

function isValid(pages: Map<number, Page>, update: Update): boolean {
    for (let i = 0; i < update.length; i++) {
        const pageNums = update.slice();
        const before = pageNums.splice(0, i);
        const after = pageNums.splice(1);
        const page = pages.get(pageNums[0]);
        if (!page) {
            console.error('failed to find page', pageNums[0], update, pages);
            return false;
        }
        for (const pageBefore of page.before) {
            if (after.includes(pageBefore)) {
                return false;
            }
        }
        for (const pageAfter of page.after) {
            if (before.includes(pageAfter)) {
                return false;
            }
        }
    }
    return true;
}

function orderUpdate(pages: Map<number, Page>, update: Update): Update {
    let i = 0;
    while (i < update.length) {
        const page = pages.get(update[i])!;
        for (const before of page.before) {
            const index = update.indexOf(before, i);
            if (index === -1) {
                continue;
            }
            update.splice(index, 1);
            update.unshift(before);
            i = -1;
            break;
        }
        i++;
    }
    return update;
}

export async function solve(
    input: string[],
    part: number,
    test: boolean,
    additionalInfo?: AdditionalInfo,
): Promise<string | number> {
    const pages = new Map<number, Page>();
    const updates: Update[] = [];
    for (const line of input) {
        if (line.includes('|')) {
            const [a, b] = line.split('|').map(p => parseInt(p, 10));
            const pageA: Page = pages.get(a) ?? {before:[], after:[]};
            const pageB: Page = pages.get(b) ?? {before:[], after:[]};
            pageA.after.push(b);
            pageB.before.push(a);
            pages.set(a, pageA);
            pages.set(b, pageB);
        } else if (line !== '') {
            updates.push(line.split(',').map(p => parseInt(p, 10)));
        }
    }
    let total = 0;
    if (part === 1) {
        for (const update of updates) {
            if (isValid(pages, update)) {
                const middlePage = update[Math.floor(update.length / 2)];
                total += middlePage;
            }
        }
    } else {
        for (const update of updates) {
            if (!isValid(pages, update)) {
                const reordered = orderUpdate(pages, update);
                const middlePage = reordered[Math.floor(reordered.length / 2)];
                total += middlePage;
            }
        }
    }
    return total;
}

run(__filename, solve);
