import { getLines } from "../common";

export default async function func(input: string) {
    let total = 0;
    const listA: number[] = [];
    const listB: number[] = [];
    for await (const line of getLines(input)) {
        const [a, b] = line.split(/\s+/);
        listA.push(parseInt(a));
        listB.push(parseInt(b));
    }
    listA.sort(
        (x, y) => x-y
    );
    listB.sort(
        (x, y) => x - y
    );
    for (let i = 0; i < listA.length; i++) {
        total +=Math.abs(listA[i] - listB[i]);
    }
    console.log(total);
}
